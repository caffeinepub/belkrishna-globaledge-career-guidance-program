import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, AssessmentSession, CareerReport, Response } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useStartAssessmentSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startAssessmentSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentSessions'] });
    },
  });
}

export function useGetAssessmentSession(sessionId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AssessmentSession | null>({
    queryKey: ['assessmentSession', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getAssessmentSession(sessionId);
    },
    enabled: !!actor && !actorFetching && !!sessionId,
  });
}

export function useSubmitResponse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, response }: { sessionId: string; response: Response }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitResponse(sessionId, response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessmentSession', variables.sessionId] });
    },
  });
}

export function useCompleteAssessmentSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeAssessmentSession(sessionId);
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['assessmentSession', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['assessmentSessions'] });
    },
  });
}

export function useGetUserAssessmentSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AssessmentSession[]>({
    queryKey: ['assessmentSessions'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserAssessmentSessions(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useCreateCareerReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, sessionId, content }: { reportId: string; sessionId: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCareerReport(reportId, sessionId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerReports'] });
    },
  });
}

export function useGetCareerReport(reportId: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CareerReport | null>({
    queryKey: ['careerReport', reportId],
    queryFn: async () => {
      if (!actor || !reportId) return null;
      return actor.getCareerReport(reportId);
    },
    enabled: !!actor && !actorFetching && !!reportId,
  });
}

export function useUpdateCareerReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, content }: { reportId: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCareerReport(reportId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['careerReport', variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ['careerReports'] });
    },
  });
}

export function useGetUserCareerReports() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CareerReport[]>({
    queryKey: ['careerReports'],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserCareerReports(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

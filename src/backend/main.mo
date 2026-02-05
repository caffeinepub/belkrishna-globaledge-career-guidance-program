import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type UserProfile = {
    name : Text;
    email : Text;
    school : Text;
  };

  public type Question = {
    id : Nat;
    text : Text;
    category : Text;
    correctAnswer : Text;
  };

  public type Response = {
    questionId : Nat;
    answer : Text;
    isCorrect : Bool;
  };

  public type AssessmentSession = {
    sessionId : Text;
    student : Principal;
    startTime : Time.Time;
    responses : [Response];
    completed : Bool;
  };

  public type Score = {
    totalQuestions : Nat;
    correctAnswers : Nat;
    accuracy : Float;
    categoryScores : [(Text, Float)];
  };

  public type CareerReport = {
    reportId : Text;
    student : Principal;
    assessmentSessionId : Text;
    generatedTime : Time.Time;
    updatedTime : Time.Time;
    content : Text;
    version : Nat;
  };

  module AssessmentSession {
    public func compare(session1 : AssessmentSession, session2 : AssessmentSession) : { #less; #equal; #greater } {
      Text.compare(session1.sessionId, session2.sessionId);
    };
  };

  module CareerReport {
    public func compare(report1 : CareerReport, report2 : CareerReport) : { #less; #equal; #greater } {
      Text.compare(report1.reportId, report2.reportId);
    };
  };

  // State Initialization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let assessmentSessions = Map.empty<Text, AssessmentSession>();
  let careerReports = Map.empty<Text, CareerReport>();

  // Public Functions

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Assessment Session Management
  public shared ({ caller }) func startAssessmentSession(sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start assessments");
    };

    let session : AssessmentSession = {
      sessionId;
      student = caller;
      startTime = Time.now();
      responses = [];
      completed = false;
    };

    assessmentSessions.add(sessionId, session);
  };

  public shared ({ caller }) func submitResponse(sessionId : Text, response : Response) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit responses");
    };

    let session = switch (assessmentSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?s) { s };
    };

    if (session.student != caller) {
      Runtime.trap("Unauthorized: You cannot submit to this session");
    };

    // Convert persistent array to mutable list, add response, then convert back to array
    let responsesList = List.fromArray<Response>(session.responses);
    responsesList.add(response);
    let updatedResponses = responsesList.toArray();
    let updatedSession : AssessmentSession = {
      sessionId = session.sessionId;
      student = caller;
      startTime = session.startTime;
      responses = updatedResponses;
      completed = session.completed;
    };

    assessmentSessions.add(sessionId, updatedSession);
  };

  public shared ({ caller }) func completeAssessmentSession(sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete assessments");
    };

    let session = switch (assessmentSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?s) { s };
    };

    if (session.student != caller) {
      Runtime.trap("Unauthorized: You cannot complete this session");
    };

    let updatedSession : AssessmentSession = {
      sessionId = session.sessionId;
      student = caller;
      startTime = session.startTime;
      responses = session.responses;
      completed = true;
    };

    assessmentSessions.add(sessionId, updatedSession);
  };

  public query ({ caller }) func getAssessmentSession(sessionId : Text) : async ?AssessmentSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sessions");
    };

    let session = switch (assessmentSessions.get(sessionId)) {
      case (null) { return null };
      case (?s) { s };
    };

    if (caller != session.student and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };

    ?session;
  };

  // Career Report Management
  public shared ({ caller }) func createCareerReport(reportId : Text, sessionId : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create reports");
    };

    let session = switch (assessmentSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?s) { s };
    };

    if (session.student != caller) {
      Runtime.trap("Unauthorized: You cannot create a report for this session");
    };

    let report : CareerReport = {
      reportId;
      student = caller;
      assessmentSessionId = sessionId;
      generatedTime = Time.now();
      updatedTime = Time.now();
      content;
      version = 1;
    };

    careerReports.add(reportId, report);
  };

  public shared ({ caller }) func updateCareerReport(reportId : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update reports");
    };

    let report = switch (careerReports.get(reportId)) {
      case (null) { Runtime.trap("Report not found") };
      case (?r) { r };
    };

    if (report.student != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You cannot update this report");
    };

    let updatedReport : CareerReport = {
      reportId = report.reportId;
      student = report.student;
      assessmentSessionId = report.assessmentSessionId;
      generatedTime = report.generatedTime;
      updatedTime = Time.now();
      content;
      version = report.version + 1;
    };

    careerReports.add(reportId, updatedReport);
  };

  public query ({ caller }) func getCareerReport(reportId : Text) : async ?CareerReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reports");
    };

    let report = switch (careerReports.get(reportId)) {
      case (null) { return null };
      case (?r) { r };
    };

    if (caller != report.student and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };

    ?report;
  };

  public query ({ caller }) func getUserCareerReports(user : Principal) : async [CareerReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access reports");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own reports");
    };

    let filteredReports = careerReports.values().filter(
      func(report) { report.student == user }
    );
    filteredReports.toArray().sort();
  };

  public query ({ caller }) func getUserAssessmentSessions(user : Principal) : async [AssessmentSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sessions");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };

    let filteredSessions = assessmentSessions.values().filter(
      func(session) { session.student == user }
    );
    filteredSessions.toArray().sort();
  };
};

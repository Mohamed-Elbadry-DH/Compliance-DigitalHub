namespace Conformix.Domain.Enums;

public enum FrameworkKind { Iso, Regulation, Maturity }

public enum ControlStatus { Compliant, InProgress, Gap, NotApplicable }

public enum RiskLevel { VeryLow = 1, Low = 2, Medium = 3, High = 4, Critical = 5 }

public enum TaskStatus { Todo, InProgress, Blocked, Done }

public enum EvidenceState { Valid, ExpiringSoon, Expired }

// Content for the quick tools: confusable-pair drills, pipeline builder, eliminate-the-option.

// ---------- Confusable-pair drills ----------
// labels: the choices. items: p = phrase, a = index of the right label, w = short reason.
const DRILLS = [
  {
    id: "trio", title: "CloudWatch / CloudTrail / Config",
    labels: ["CloudWatch", "CloudTrail", "AWS Config"],
    items: [
      { p: "Page the on-call team when CPU stays above 85 percent", a: 0, w: "A performance number crossing a threshold is a CloudWatch alarm." },
      { p: "Which IAM user deleted the cluster?", a: 1, w: "Who made which API call is CloudTrail." },
      { p: "Prove that every bucket had encryption enabled over the last six months", a: 2, w: "Configuration history and compliance over time is Config." },
      { p: "Alert when the failed-jobs metric goes above 5", a: 0, w: "Metric plus threshold is CloudWatch." },
      { p: "Keep a record of API calls in the account for an audit", a: 1, w: "CloudTrail is the API audit log." },
      { p: "Flag any security group that allows SSH from anywhere", a: 2, w: "A compliance rule on resource configuration is Config." },
      { p: "Search application logs interactively for error messages", a: 0, w: "CloudWatch Logs Insights queries logs." },
      { p: "What did this resource's configuration look like last Tuesday?", a: 2, w: "Config keeps the configuration timeline." },
      { p: "Who called PutBucketPolicy, and from which IP address?", a: 1, w: "Caller identity and source IP are in CloudTrail events." },
      { p: "Dashboard of Glue job metrics", a: 0, w: "Metrics and dashboards are CloudWatch." }
    ]
  },
  {
    id: "rs-query", title: "Redshift: Spectrum / Federated / Datashare",
    labels: ["Spectrum", "Federated query", "Datashare"],
    items: [
      { p: "Join Redshift tables with Parquet files in S3 without loading them", a: 0, w: "External data in S3 is Spectrum." },
      { p: "Query live data in an Aurora PostgreSQL database from Redshift", a: 1, w: "Relational sources (RDS, Aurora) are federated query." },
      { p: "Give another Redshift cluster live read access with no copy", a: 2, w: "Redshift to Redshift is a datashare." },
      { p: "Query RDS MySQL tables from Redshift without an ETL job", a: 1, w: "Federated query reaches RDS and Aurora MySQL or PostgreSQL." },
      { p: "Share live tables with a Redshift Serverless workgroup in another account", a: 2, w: "Datashares work across accounts and to Serverless." },
      { p: "External tables defined in the Glue Data Catalog over S3 files", a: 0, w: "Spectrum reads external tables over S3." }
    ]
  },
  {
    id: "kin", title: "Streams / Firehose / Flink / Lambda",
    labels: ["Kinesis Data Streams", "Firehose", "Managed Flink", "Lambda"],
    items: [
      { p: "Deliver to S3 as Parquet with no code, near real time", a: 1, w: "Firehose delivers and can convert format." },
      { p: "Several consumers, and replay the last three days", a: 0, w: "Streams with retention supports multiple consumers and replay." },
      { p: "Five-minute tumbling window totals per device", a: 2, w: "Stateful windows are Flink." },
      { p: "Enrich or reformat each record on its own, no state", a: 3, w: "Stateless per-record work suits Lambda." },
      { p: "Custom sub-second processing with a retention window", a: 0, w: "Streams is the pipe for custom consumers." },
      { p: "Join two streams over a time window", a: 2, w: "Joins over time need Flink's state." },
      { p: "Buffer by size or time, then deliver to OpenSearch", a: 1, w: "Buffered delivery to a destination is Firehose." }
    ]
  },
  {
    id: "athena-glue", title: "Partition projection / CTAS / Crawler / Workgroup",
    labels: ["Partition projection", "CTAS", "Glue crawler", "Athena workgroup"],
    items: [
      { p: "Athena should see new daily partitions without registering them", a: 0, w: "Projection computes partitions from a pattern." },
      { p: "Create a new Parquet table from a query over CSV data", a: 1, w: "CTAS writes query results into a new table." },
      { p: "Infer the schema and add new columns to the catalog table", a: 2, w: "Crawlers discover schema and update the table." },
      { p: "Limit data scanned per team and track cost per team", a: 3, w: "Workgroups give per-team limits and cost tracking." },
      { p: "Thousands of date partitions and no MSCK REPAIR", a: 0, w: "Projection removes the need to register partitions." },
      { p: "Rewrite results as partitioned, compressed output", a: 1, w: "CTAS sets format and partitioning for the new table." },
      { p: "Discover the schema of new files in S3", a: 2, w: "Discovery is a crawler's job." }
    ]
  },
  {
    id: "s3-global", title: "CloudFront / Transfer Acceleration / Replication",
    labels: ["CloudFront", "S3 Transfer Acceleration", "Cross-Region Replication"],
    items: [
      { p: "Viewers around the world download videos quickly", a: 0, w: "Content going out to viewers is CloudFront." },
      { p: "Remote offices upload large files to one bucket faster", a: 1, w: "Faster uploads over distance is Transfer Acceleration." },
      { p: "Keep a copy of objects in another Region for disaster recovery", a: 2, w: "Copies in another Region are replication." },
      { p: "Serve private content with signed URLs", a: 0, w: "Signed URLs are a CloudFront feature." },
      { p: "Automatically copy new objects to a bucket in eu-west-1", a: 2, w: "Automatic copying between Regions is CRR." },
      { p: "Use edge locations to speed up uploads", a: 1, w: "Transfer Acceleration uses edge locations for uploads." }
    ]
  },
  {
    id: "lambda-conc", title: "Reserved / Provisioned / Parallelization factor",
    labels: ["Reserved concurrency", "Provisioned concurrency", "Parallelization factor"],
    items: [
      { p: "Avoid cold starts for a latency-sensitive function", a: 1, w: "Provisioned concurrency keeps environments warm." },
      { p: "Cap a function so it cannot overwhelm the database", a: 0, w: "Reserved concurrency is a limit." },
      { p: "Process more batches per shard at the same time", a: 2, w: "Parallelization factor raises concurrency per shard." },
      { p: "Guarantee a function always has capacity available", a: 0, w: "Reserved concurrency sets capacity aside." },
      { p: "Keep execution environments initialized and ready", a: 1, w: "That is what provisioned concurrency does." },
      { p: "IteratorAge keeps rising and the shard count is fixed", a: 2, w: "Parallelization factor is the lever that does not need more shards." }
    ]
  },
  {
    id: "orch", title: "Glue workflow / Step Functions / MWAA / EventBridge",
    labels: ["Glue workflow", "Step Functions", "MWAA", "EventBridge"],
    items: [
      { p: "Existing Airflow DAGs to move to AWS", a: 2, w: "MWAA runs Airflow." },
      { p: "Run a crawler and two Glue jobs in order, all inside Glue", a: 0, w: "Glue workflows orchestrate Glue crawlers and jobs." },
      { p: "Retry with backoff across Glue, EMR and Lambda steps", a: 1, w: "Step Functions coordinates services with retries." },
      { p: "Start something when an S3 object is created", a: 3, w: "Event routing is EventBridge." },
      { p: "Run on a cron schedule with no server", a: 3, w: "EventBridge Scheduler handles schedules." },
      { p: "Wait for a human approval before continuing", a: 1, w: "Step Functions can wait for a task token callback." }
    ]
  },
  {
    id: "access", title: "Lake Formation / IAM / Glue catalog policy / SCP",
    labels: ["Lake Formation", "IAM policy", "Glue catalog policy", "SCP"],
    items: [
      { p: "Hide one column of a catalog table from some users", a: 0, w: "Column-level control is Lake Formation." },
      { p: "Let a Glue job write to one specific bucket", a: 1, w: "Service permissions are an IAM role with a policy." },
      { p: "Stop every account in the organization from using other Regions", a: 3, w: "Organization-wide limits are SCPs." },
      { p: "Filter rows by region on a cataloged table", a: 0, w: "Row filters are Lake Formation data filters." },
      { p: "Let a Lambda function read one S3 prefix", a: 1, w: "IAM role policy scoped to the prefix." },
      { p: "A maximum that no account administrator can exceed", a: 3, w: "SCPs cap what even admins can do." }
    ]
  },
  {
    id: "secrets", title: "Secrets Manager / Parameter Store / KMS",
    labels: ["Secrets Manager", "Parameter Store", "KMS"],
    items: [
      { p: "Rotate database credentials every 30 days automatically", a: 0, w: "Built-in rotation is Secrets Manager." },
      { p: "Store non-secret configuration values cheaply", a: 1, w: "Parameter Store is the cheap place for config." },
      { p: "Control the keys that encrypt S3 data and audit their use", a: 2, w: "Key control and audit is KMS." },
      { p: "Disable a key to cut off access to encrypted data", a: 2, w: "Disabling a customer managed KMS key blocks decryption." },
      { p: "Store an API token and rotate it on a schedule", a: 0, w: "Scheduled rotation is a Secrets Manager feature." }
    ]
  }
];

// ---------- Pipeline builder ----------
// Each stage: choose one option. a = index of the right option, w = why it is right.
const PIPES = [
  {
    id: "clickstream", title: "Clickstream into an Athena-ready lake", d: 1,
    story: "Web servers produce JSON clickstream events all day. The company wants them in S3 as partitioned Parquet within minutes, queryable with SQL, with the schema kept current. The team is small and wants the least overhead. Delivery failures must alert the team.",
    stages: [
      { name: "Ingest and convert", o: ["Kinesis Data Streams with a KCL application on EC2", "Kinesis Data Firehose with format conversion and dynamic partitioning", "SQS with a Lambda function writing Parquet", "A Glue streaming job on a long-running cluster"], a: 1, w: "Firehose delivers near real time and converts and partitions without code." },
      { name: "Keep the table definition current", o: ["A scheduled Glue crawler on the S3 prefix", "A hand-written table updated by an engineer", "A DataBrew job", "An AWS Config rule"], a: 0, w: "A crawler discovers schema and partitions on a schedule." },
      { name: "Query", o: ["A provisioned Redshift cluster", "Amazon Athena", "EMR with Presto", "Amazon OpenSearch Service"], a: 1, w: "Athena is serverless SQL on S3." },
      { name: "Alert on delivery problems", o: ["CloudTrail", "Macie", "A CloudWatch alarm on Firehose delivery metrics that notifies SNS", "IAM Access Analyzer"], a: 2, w: "A metric threshold is a CloudWatch alarm." }
    ],
    r: "Firehose for no-code delivery, crawler for schema, Athena for SQL, CloudWatch for metric alarms."
  },
  {
    id: "fraud", title: "Real-time card fraud alerts", d: 1,
    story: "Card transactions arrive continuously. The company needs five-minute spending totals per card computed within seconds, an alert to the fraud team when a total looks unusual, and the raw events kept for seven days so the logic can be re-run after a fix.",
    stages: [
      { name: "Ingest and keep the raw events", o: ["Kinesis Data Firehose", "Kinesis Data Streams with 7-day retention", "SQS standard queue", "SNS topic"], a: 1, w: "Streams keeps records for replay and supports custom consumers." },
      { name: "Compute the windowed totals", o: ["Lambda per record keeping state in memory", "Athena queries every five minutes", "Amazon Managed Service for Apache Flink", "A nightly Glue job"], a: 2, w: "Windowed, stateful aggregation in real time is Flink." },
      { name: "Notify the fraud team", o: ["An SQS queue", "CloudWatch Logs", "EventBridge Scheduler", "An SNS topic"], a: 3, w: "SNS pushes notifications to people and systems." }
    ],
    r: "Streams for retention and replay, Flink for windows, SNS to notify."
  },
  {
    id: "partner-files", title: "Nightly partner files into a warehouse", d: 1,
    story: "Partner CSV files land in S3 each night. They must be validated and cleaned, then loaded into a warehouse that analysts use only a few hours a day. Analysts must not see the salary column. The team wants to avoid idle cost and server management.",
    stages: [
      { name: "Validate and transform", o: ["A Lambda function per file", "An always-on EMR cluster", "A Glue ETL job with Glue Data Quality rules", "A DataBrew dataset only"], a: 2, w: "Glue ETL with Data Quality validates and transforms without servers." },
      { name: "Warehouse", o: ["Provisioned Redshift running all day", "Amazon Redshift Serverless", "DynamoDB", "RDS for MySQL"], a: 1, w: "Serverless charges for use, which suits a few hours a day." },
      { name: "Hide the salary column", o: ["Column-level permissions on the table (GRANT on selected columns)", "An S3 bucket policy", "A CloudTrail trail", "A security group rule"], a: 0, w: "Column-level grants restrict which columns analysts can read." }
    ],
    r: "Glue Data Quality for validation, Serverless for intermittent use, column-level permissions for hiding a column."
  },
  {
    id: "oracle-aurora", title: "Oracle to Aurora with minimal downtime", d: 2,
    story: "An on-premises Oracle database with many stored procedures must move to Aurora PostgreSQL. The application can be offline for only minutes. After cutover, the security team wants a record of who changes the database configuration.",
    stages: [
      { name: "Convert the schema and code", o: ["AWS DataSync", "AWS Schema Conversion Tool", "A Glue crawler", "Amazon AppFlow"], a: 1, w: "SCT converts schema and code between different engines." },
      { name: "Move the data", o: ["DMS with full load only", "A Snowball Edge device", "DMS with full load plus CDC", "S3 Batch Operations"], a: 2, w: "CDC keeps source and target in sync until cutover." },
      { name: "Record who changes configuration", o: ["AWS CloudTrail", "Amazon CloudWatch metrics", "Amazon Macie", "AWS Budgets"], a: 0, w: "CloudTrail records API calls with the caller." }
    ],
    r: "SCT converts, DMS full load plus CDC moves, CloudTrail records who."
  }
];

// ---------- Eliminate the option ----------
// A scenario, a proposed solution, and the requirements. a = index of the requirement the solution fails.
const ELIM = [
  { s: "Ingest events into S3 as Parquet within minutes, with the least overhead and no servers.", o: "Kinesis Data Streams with a KCL application running on EC2 that writes Parquet.", reqs: ["Delivery within minutes", "No servers to manage", "Output is Parquet"], a: 1, w: "The KCL application runs on EC2 instances you must manage." },
  { s: "Make nightly partner files queryable in Athena. New columns and new daily partitions must appear automatically.", o: "Define partition projection on the table.", reqs: ["Queryable in Athena", "New columns appear automatically", "New daily partitions are found"], a: 1, w: "Projection finds partitions but does not add new columns." },
  { s: "Keep logs for seven years. Retrieval must take minutes during the first year and hours are fine afterward. Use the cheapest option that fits.", o: "Move the logs to S3 Glacier Deep Archive after 30 days.", reqs: ["Retained for seven years", "Retrieval within minutes in the first year", "Cheapest option that fits"], a: 1, w: "Deep Archive retrieval takes hours, not minutes." },
  { s: "A Lambda function reading a Kinesis stream is falling behind. The shard count cannot change.", o: "Increase the function's reserved concurrency.", reqs: ["Raises read throughput per shard", "Needs no shard changes", "Works with Lambda"], a: 0, w: "Reserved concurrency is a limit and does not raise per-shard throughput." },
  { s: "An EC2 application needs database credentials that rotate automatically every 30 days.", o: "Store the credentials in Parameter Store as a SecureString.", reqs: ["Credentials stored encrypted", "Automatic rotation every 30 days", "EC2 application can read them"], a: 1, w: "Parameter Store has no built-in rotation of database credentials." },
  { s: "Managers must see only some columns of a Glue Data Catalog table, managed centrally.", o: "A Glue Data Catalog resource policy.", reqs: ["Column-level control", "Managed centrally", "Table is in the Glue Data Catalog"], a: 0, w: "Catalog resource policies work at table level, not column level." },
  { s: "A test environment uses live production data for two hours every two weeks and should cost as little as possible.", o: "A datashare to a provisioned RA3 cluster that stays running.", reqs: ["Uses live data without copying", "Pay only when used", "Does not affect production"], a: 1, w: "A provisioned cluster bills while idle. Serverless would not." },
  { s: "Get logs into S3 as partitioned Parquet within minutes.", o: "Firehose delivers raw JSON, and a nightly Glue job converts it to Parquet.", reqs: ["Parquet output", "Partitioned by customer", "Available within minutes"], a: 2, w: "Parquet only appears after the nightly job." }
];

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
      { p: "Sessionize clickstream events with event-time windows and watermarks", a: 2, w: "Event-time windows with large state are Flink." },
      { p: "Enrich or reformat each record on its own, no state", a: 3, w: "Stateless per-record work suits Lambda." },
      { p: "Records kept in order per key for a retention window", a: 0, w: "Streams keeps per-shard order and retains records for replay." },
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
      { p: "Set aside part of the account's concurrency for one function", a: 0, w: "Reserved concurrency sets capacity aside." },
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
      { p: "Fire a rule every night at 2 AM that starts a state machine", a: 3, w: "EventBridge schedules and routes to targets." },
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
  },
  {
    id: "glue-parts", title: "Glue: crawler / job / DataBrew / Data Quality / workflow",
    labels: ["Crawler", "ETL job", "DataBrew", "Data Quality", "Workflow"],
    items: [
      { p: "Infer the schema and partitions of new files", a: 0, w: "Discovery and catalog population is a crawler's job." },
      { p: "Convert 2 TB of CSV to partitioned Parquet with Spark", a: 1, w: "Heavy transformation is a Glue ETL job." },
      { p: "Analysts clean data with clicks and no code", a: 2, w: "No-code recipes are DataBrew." },
      { p: "Flag rows where customer_id is null", a: 3, w: "Rule-based validation is Glue Data Quality." },
      { p: "Run a crawler, then two jobs in parallel, then another crawler", a: 4, w: "Glue workflows chain Glue crawlers and jobs with triggers." },
      { p: "Profile a dataset and see value distributions without code", a: 2, w: "DataBrew has built-in profile jobs." },
      { p: "Rules written in DQDL", a: 3, w: "DQDL is the Glue Data Quality language." },
      { p: "Join and aggregate with PySpark", a: 1, w: "Spark code runs in a Glue ETL job." },
      { p: "Add new partitions to a Data Catalog table", a: 0, w: "Crawlers register partitions." }
    ]
  },
  {
    id: "dqdl-nulls", title: "DQDL: IsComplete / Completeness / IsUnique / Uniqueness / IsPrimaryKey",
    labels: ["IsComplete", "Completeness", "IsUnique", "Uniqueness", "IsPrimaryKey"],
    items: [
      { p: "No missing values in the column", a: 0, w: "IsComplete is a yes/no check for no nulls." },
      { p: "At least 98 percent of values must be present", a: 1, w: "Completeness returns a ratio, so compare it with >= 0.98." },
      { p: "No value may appear twice", a: 2, w: "IsUnique is a yes/no check." },
      { p: "At least 90 percent of values must occur exactly once", a: 3, w: "Uniqueness returns the share of unique values." },
      { p: "The column is a key: unique and never null", a: 4, w: "IsPrimaryKey combines both checks." },
      { p: "Shorthand for Completeness = 1.0", a: 0, w: "IsComplete is the yes/no form of Completeness = 1.0." },
      { p: "A few duplicates are fine but you want a ratio", a: 3, w: "Uniqueness takes an expression such as >= 0.9." }
    ]
  },
  {
    id: "dqdl-checks", title: "DQDL: ColumnValues / ColumnLength / RowCount / DataFreshness / ...",
    labels: ["ColumnValues", "ColumnLength", "RowCount", "DataFreshness", "ReferentialIntegrity", "CustomSql"],
    items: [
      { p: "Zip code must be exactly 5 characters", a: 1, w: "String length is ColumnLength." },
      { p: "Status must be one of A, B or C", a: 0, w: "Allowed values use ColumnValues with in [...]." },
      { p: "The file must contain more than 1,000 rows", a: 2, w: "Dataset size is RowCount." },
      { p: "Order dates must be no older than 24 hours", a: 3, w: "Age of a date column against now is DataFreshness (with a time unit)." },
      { p: "Every customer_id must exist in the customers dataset", a: 4, w: "Foreign-key style checks are ReferentialIntegrity." },
      { p: "Check a custom relationship with a SQL query returning one number", a: 5, w: "CustomSql runs a quoted query and compares the result." },
      { p: "Email must match a regular expression", a: 0, w: "ColumnValues ... matches \"regex\"." },
      { p: "Values must be between 1 and 100", a: 0, w: "ColumnValues ... between 1 and 100." }
    ]
  },
  {
    id: "crawler-settings", title: "Crawler settings: incremental / S3 events / policy / classifier",
    labels: ["Incremental crawl", "S3 event mode", "Schema change policy", "Custom classifier", "Exclude pattern", "Table level"],
    items: [
      { p: "Only crawl new folders; the schema is stable", a: 0, w: "Incremental crawls add new partitions and only log schema changes." },
      { p: "Crawl only folders that changed, based on S3 notifications through SQS", a: 1, w: "S3 event mode re-crawls just the changed folders." },
      { p: "Stop the crawler from overwriting my manual column types", a: 2, w: "The schema change policy controls updates to existing definitions." },
      { p: "Fixed-width text files the built-in classifiers do not recognize", a: 3, w: "Custom classifiers (grok, XML, JSON, CSV) teach the crawler formats it does not recognize." },
      { p: "Skip _temporary folders and .tmp files", a: 4, w: "Exclude patterns keep files out of the crawl." },
      { p: "Tell the crawler at which folder depth each table starts", a: 5, w: "The table level setting defines where tables are rooted." },
      { p: "Add new columns but keep existing column definitions", a: 2, w: "That is the add new columns only option." },
      { p: "Grok pattern for application log lines", a: 3, w: "Grok is a custom classifier type." }
    ]
  },
  {
    id: "glue-tuning", title: "Glue tuning: groupFiles / pushdown / bookmarks / flex",
    labels: ["groupFiles", "push_down_predicate", "Job bookmarks", "Auto scaling", "Flex", "Partition index"],
    items: [
      { p: "Millions of tiny files overload the driver", a: 0, w: "groupFiles with groupSize makes fewer, bigger read tasks." },
      { p: "Read only one day's partition of a catalog table", a: 1, w: "A push-down predicate prunes partitions before reading." },
      { p: "Process only new files since the last run", a: 2, w: "Bookmarks keep state between runs." },
      { p: "Load varies a lot and nobody knows the right worker count", a: 3, w: "Auto scaling adds and removes workers as needed." },
      { p: "Non-urgent nightly job; pay less per DPU-hour", a: 4, w: "Flex execution runs on spare capacity at a lower price." },
      { p: "A table has hundreds of thousands of partitions and lookups are slow", a: 5, w: "Partition indexes speed up partition retrieval." },
      { p: "Needs job.init, job.commit and transformation_ctx", a: 2, w: "Those are the bookmark requirements." },
      { p: "A filter string such as dt = '2024-06-01' passed to the read", a: 1, w: "A push-down predicate prunes partitions before reading." }
    ]
  },
  {
    id: "rs-tuning", title: "Redshift tuning: keys / MV / scaling / VACUUM / ANALYZE",
    labels: ["DISTKEY", "SORTKEY", "DISTSTYLE ALL", "Materialized view", "Concurrency scaling", "VACUUM", "ANALYZE"],
    items: [
      { p: "Colocate rows of two big tables joined on the same column", a: 0, w: "A shared DISTKEY avoids redistribution." },
      { p: "Skip blocks for a date range filter", a: 1, w: "Sort keys feed zone maps." },
      { p: "Small dimension table joined to many facts", a: 2, w: "ALL copies the table to every node." },
      { p: "Repeated heavy aggregate whose result is precomputed", a: 3, w: "Materialized views store results and can auto refresh." },
      { p: "Queries queue at the morning peak", a: 4, w: "Concurrency scaling adds transient capacity for queued queries." },
      { p: "Deleted rows and unsorted rows after many updates", a: 5, w: "VACUUM reclaims space and re-sorts." },
      { p: "Statistics are stale after a large load (stats_off is high)", a: 6, w: "ANALYZE refreshes planner statistics." },
      { p: "Zone maps", a: 1, w: "Zone maps work on sorted blocks." }
    ]
  },
  {
    id: "rs-data-movement", title: "Redshift data movement: COPY / UNLOAD / Spectrum / streaming ...",
    labels: ["COPY", "UNLOAD", "Spectrum", "Streaming ingestion", "Zero-ETL", "Auto-copy", "Data API"],
    items: [
      { p: "Bulk load files from S3 into a table", a: 0, w: "COPY, with an IAM role and many files in parallel." },
      { p: "Export a query result to S3 as Parquet", a: 1, w: "UNLOAD writes out of Redshift." },
      { p: "Query Parquet in S3 without loading it", a: 2, w: "External tables via Spectrum." },
      { p: "Kinesis records visible in seconds through a materialized view", a: 3, w: "Streaming ingestion reads Kinesis or MSK directly." },
      { p: "Aurora changes replicated into Redshift with no pipeline", a: 4, w: "Zero-ETL integration." },
      { p: "New files in an S3 prefix loaded once, automatically", a: 5, w: "A COPY job (auto-copy) tracks loaded files." },
      { p: "Run SQL from Lambda without a persistent connection", a: 6, w: "The Data API is asynchronous and connectionless." },
      { p: "Needs IAM_ROLE and several similar-sized files", a: 0, w: "That is how COPY loads in parallel." }
    ]
  },
  {
    id: "dynamodb-features", title: "DynamoDB: GSI / LSI / Streams / TTL / DAX / Export",
    labels: ["GSI", "LSI", "DynamoDB Streams", "TTL", "DAX", "Export to S3", "On-demand mode"],
    items: [
      { p: "Query by a different partition key", a: 0, w: "A GSI has its own key schema." },
      { p: "Same partition key, different sort key, defined at table creation", a: 1, w: "LSIs share the partition key and must be created with the table." },
      { p: "Ordered change events kept for 24 hours", a: 2, w: "That is DynamoDB Streams." },
      { p: "Delete expired items without using write capacity", a: 3, w: "TTL deletions are free of WCU." },
      { p: "Microsecond read cache with the DynamoDB API", a: 4, w: "DAX." },
      { p: "Analytics copy without consuming read capacity (needs PITR)", a: 5, w: "Exports read from continuous backups." },
      { p: "Unpredictable traffic, no capacity planning", a: 6, w: "On-demand scales with traffic and bills per request." },
      { p: "Trigger a Lambda function on item changes", a: 2, w: "Streams feed Lambda event source mappings." }
    ]
  },
  {
    id: "s3-class-choice", title: "S3 storage classes",
    labels: ["Standard-IA", "Glacier Instant", "Glacier Flexible", "Deep Archive", "Intelligent-Tiering", "One Zone-IA"],
    items: [
      { p: "Read monthly, needs instant access, multi-AZ", a: 0, w: "Standard-IA: infrequent but immediate." },
      { p: "Read once a quarter, instant, kept for years", a: 1, w: "Glacier Instant Retrieval: archive price, millisecond access." },
      { p: "Archive, retrieval in minutes to hours is fine", a: 2, w: "Glacier Flexible Retrieval." },
      { p: "Cheapest, retrieval takes about 12 hours, seven-year retention", a: 3, w: "Deep Archive." },
      { p: "Access pattern unknown or changing", a: 4, w: "Intelligent-Tiering moves objects automatically." },
      { p: "Reproducible data, rarely read, a single AZ is acceptable", a: 5, w: "One Zone-IA stores in one AZ." },
      { p: "Minimum storage duration of 180 days", a: 3, w: "Deep Archive." },
      { p: "Has an expedited retrieval option", a: 2, w: "Flexible Retrieval offers expedited, standard and bulk." }
    ]
  },
  {
    id: "s3-feature-choice", title: "S3 features: Object Lock / replication / lifecycle / events",
    labels: ["Object Lock", "Versioning", "Replication", "Lifecycle rule", "Event notifications", "Access Points", "Inventory"],
    items: [
      { p: "WORM: nobody can delete for seven years", a: 0, w: "Object Lock in compliance mode." },
      { p: "Recover from an accidental overwrite", a: 1, w: "Versioning keeps previous versions." },
      { p: "Copy new objects to another Region automatically", a: 2, w: "Cross-Region replication." },
      { p: "Move to Glacier after 90 days, then expire", a: 3, w: "Lifecycle transition and expiration rules." },
      { p: "Start processing when an object is created", a: 4, w: "Event notifications, directly or through EventBridge." },
      { p: "Separate policy per team on one bucket", a: 5, w: "Access points each carry their own policy." },
      { p: "Daily list of objects and metadata for auditing", a: 6, w: "S3 Inventory." },
      { p: "Needs versioning on both buckets", a: 2, w: "Replication requires versioning." }
    ]
  },
  {
    id: "transfer-tools", title: "Moving data in: DataSync / Transfer Family / Snow / DMS / AppFlow",
    labels: ["DataSync", "Transfer Family", "Snow Family", "DMS", "AppFlow"],
    items: [
      { p: "Nightly sync of an NFS share to S3 with checksum verification", a: 0, w: "DataSync handles file shares." },
      { p: "Partners upload with SFTP straight into S3", a: 1, w: "Transfer Family hosts the SFTP endpoint." },
      { p: "400 TB over a slow link, one time", a: 2, w: "Ship it with Snowball Edge." },
      { p: "Replicate a database with ongoing changes", a: 3, w: "DMS with CDC." },
      { p: "Pull Salesforce records into S3 on a schedule", a: 4, w: "AppFlow connects SaaS sources." },
      { p: "Remote site needs local processing before shipping", a: 2, w: "Snowball Edge Compute Optimized." },
      { p: "Scheduled copies between on-premises storage and EFS or FSx", a: 0, w: "DataSync supports those targets." }
    ]
  },
  {
    id: "db-choice", title: "Which database?",
    labels: ["Aurora / RDS", "DynamoDB", "Redshift", "Neptune", "DocumentDB", "Keyspaces", "OpenSearch", "MemoryDB"],
    items: [
      { p: "Transactional app with joins", a: 0, w: "Relational OLTP." },
      { p: "Key-value, single-digit milliseconds at any scale", a: 1, w: "DynamoDB." },
      { p: "Petabyte analytics and BI", a: 2, w: "Redshift is the warehouse." },
      { p: "Find connections in a social graph", a: 3, w: "Graph database: Neptune." },
      { p: "MongoDB-compatible", a: 4, w: "DocumentDB." },
      { p: "Cassandra-compatible with CQL", a: 5, w: "Keyspaces." },
      { p: "Full-text search and log dashboards", a: 6, w: "OpenSearch." },
      { p: "Redis-compatible primary database that is durable, with microsecond reads", a: 7, w: "MemoryDB is durable. ElastiCache is a cache." },
      { p: "Detect fraud rings through relationships", a: 3, w: "Graph queries suit relationship data." }
    ]
  },
  {
    id: "messaging-choice", title: "SQS / SNS / EventBridge / Kinesis",
    labels: ["SQS", "SNS", "EventBridge", "Kinesis Data Streams"],
    items: [
      { p: "Buffer between producer and consumer with retries and a dead-letter queue", a: 0, w: "SQS." },
      { p: "Push one message to many subscribers", a: 1, w: "SNS fan-out." },
      { p: "Route events by pattern from AWS services and SaaS", a: 2, w: "EventBridge rules." },
      { p: "Replay the last three days to a new consumer", a: 3, w: "Streams keep data for the retention period." },
      { p: "Cron-style schedule that starts a target", a: 2, w: "EventBridge Scheduler or scheduled rules." },
      { p: "Order per key, several readers, replay", a: 3, w: "Shards keep order per partition key." },
      { p: "Each message is deleted after successful processing", a: 0, w: "Queue semantics." },
      { p: "Subscription filter policies", a: 1, w: "SNS filters per subscriber." }
    ]
  },
  {
    id: "athena-features", title: "Athena features",
    labels: ["Partition projection", "CTAS", "Workgroup", "Federated query", "Iceberg table", "Result reuse", "Provisioned capacity"],
    items: [
      { p: "Avoid registering thousands of partitions", a: 0, w: "Projection computes partitions from a pattern." },
      { p: "Write query results as a new partitioned Parquet table", a: 1, w: "CTAS." },
      { p: "Per-team scan limits and cost tags", a: 2, w: "Workgroups." },
      { p: "Query an RDS database through a Lambda connector", a: 3, w: "Federated query data source connectors." },
      { p: "MERGE, updates, deletes and time travel", a: 4, w: "Iceberg tables." },
      { p: "Same query repeated by many dashboards, skip re-scanning", a: 5, w: "Query result reuse." },
      { p: "Reserve DPUs for predictable concurrency", a: 6, w: "Provisioned capacity." },
      { p: "Data source connectors", a: 3, w: "Federated query." }
    ]
  },
  {
    id: "compute-choice", title: "Which compute for the ETL?",
    labels: ["Glue ETL", "Glue Python shell", "EMR on EC2", "EMR Serverless", "Lambda", "AWS Batch"],
    items: [
      { p: "Serverless Spark integrated with the Data Catalog", a: 0, w: "Glue ETL." },
      { p: "Small pandas job running 50 minutes", a: 1, w: "Python shell has no 15-minute limit and bills fractional DPUs." },
      { p: "Custom Hadoop ecosystem versions and bootstrap actions", a: 2, w: "Full control means EMR on EC2." },
      { p: "Spark or Hive without managing a cluster, with warm pre-initialized workers", a: 3, w: "EMR Serverless." },
      { p: "Per-event processing under 15 minutes", a: 4, w: "Lambda." },
      { p: "Two-hour containerized job needing a lot of memory", a: 5, w: "AWS Batch." },
      { p: "HDFS on core nodes and Spot task nodes", a: 2, w: "That is an EMR cluster layout." },
      { p: "Visual job authoring in Glue Studio", a: 0, w: "Glue Studio builds Glue ETL jobs." }
    ]
  },
  {
    id: "service-limits", title: "Limits: Lambda / Express / Glue / Athena / shard",
    labels: ["Lambda", "Step Functions Express", "Glue", "Athena", "Kinesis shard"],
    items: [
      { p: "Maximum run time of 15 minutes", a: 0, w: "Lambda's timeout cap." },
      { p: "Maximum run time of 5 minutes", a: 1, w: "Express workflows are short-lived." },
      { p: "1 MB per second or 1,000 records per second in", a: 4, w: "Per-shard write limits." },
      { p: "Default DML query timeout of 30 minutes", a: 3, w: "Athena." },
      { p: "Job timeout counted in days, no 15-minute cap", a: 2, w: "Glue batch jobs default to 48 hours." },
      { p: "Up to 10 GB memory and 10 GB of /tmp", a: 0, w: "Lambda's maximums." },
      { p: "2 MB per second out, shared or per consumer with fan-out", a: 4, w: "Per-shard read limits." },
      { p: "Container images up to 10 GB", a: 0, w: "Lambda container image limit." }
    ]
  },
  {
    id: "log-tools", title: "Log analysis tools",
    labels: ["Logs Insights", "Metric filter", "Subscription filter", "CloudTrail Lake", "Athena on S3 logs"],
    items: [
      { p: "Interactive query of recent application logs", a: 0, w: "Logs Insights." },
      { p: "Turn a number in a log line into a metric", a: 1, w: "Metric filters create metrics from patterns." },
      { p: "Stream logs in real time to Firehose or Lambda", a: 2, w: "Subscription filters." },
      { p: "SQL over years of API activity across accounts, with no tables to build", a: 3, w: "CloudTrail Lake." },
      { p: "Analyze years of ALB or S3 access logs already in S3", a: 4, w: "Athena over S3." },
      { p: "Count errors per five minutes right now", a: 0, w: "stats count(*) by bin(5m)." },
      { p: "Feeds a CloudWatch alarm", a: 1, w: "The extracted metric is what the alarm watches." }
    ]
  },
  {
    id: "lf-pieces", title: "Lake Formation pieces",
    labels: ["LF-tags", "Data filter", "Resource link", "AWS RAM", "Registered location", "Hybrid access mode"],
    items: [
      { p: "Scale permissions by data classification", a: 0, w: "Tag-based access control." },
      { p: "Hide columns and rows from some principals", a: 1, w: "Data filters." },
      { p: "Local pointer to a table shared from another account", a: 2, w: "Resource links." },
      { p: "The mechanism that shares resources between accounts", a: 3, w: "Resource Access Manager." },
      { p: "Lets Lake Formation manage access to an S3 path", a: 4, w: "Registered data lake location." },
      { p: "Adopt Lake Formation gradually while IAM-based access keeps working", a: 5, w: "Hybrid access mode." },
      { p: "Cell-level security", a: 1, w: "Row plus column filters together." },
      { p: "Needed so Athena can query a cross-account shared table by name", a: 2, w: "Create a resource link in the consumer account." }
    ]
  },
  {
    id: "kinesis-metrics", title: "Kinesis symptoms and metrics",
    labels: ["WriteProvisionedThroughputExceeded", "ReadProvisionedThroughputExceeded", "GetRecords.IteratorAgeMilliseconds", "IncomingBytes"],
    items: [
      { p: "Producers are getting throttled", a: 0, w: "Writes exceeded shard limits." },
      { p: "Consumers get throttled on GetRecords", a: 1, w: "Reads exceeded the shard's read limits." },
      { p: "A consumer is falling behind the tip of the stream", a: 2, w: "Iterator age shows consumer lag." },
      { p: "How much data producers are sending", a: 3, w: "IncomingBytes." },
      { p: "Lambda consumer lag", a: 2, w: "IteratorAge." },
      { p: "Too many consumers sharing a shard's read throughput", a: 1, w: "Enhanced fan-out fixes it." },
      { p: "One shard is hot on writes", a: 0, w: "Hot partition key." }
    ]
  },
  {
    id: "lambda-esm-settings", title: "Lambda event source mapping settings",
    labels: ["Batch size", "Batching window", "Parallelization factor", "Bisect on error", "Maximum concurrency", "Report batch item failures"],
    items: [
      { p: "Process up to 10 batches per shard at once", a: 2, w: "Stream sources only." },
      { p: "Wait up to a minute to gather more records before invoking", a: 1, w: "The batching window." },
      { p: "Split a failing batch to isolate a poison record", a: 3, w: "Bisect batch on function error." },
      { p: "Cap concurrent invocations from an SQS queue without throttling", a: 4, w: "Maximum concurrency on the mapping." },
      { p: "Only return the failed messages to the queue", a: 5, w: "Partial batch response." },
      { p: "Number of records per invocation", a: 0, w: "Batch size." },
      { p: "Needed to go above 10 messages per batch on a standard SQS queue", a: 1, w: "Larger batches require a batching window." }
    ]
  },
  {
    id: "sfn-features", title: "Step Functions features",
    labels: ["Retry", "Catch", "Map", "Parallel", "Wait", ".sync", ".waitForTaskToken"],
    items: [
      { p: "Re-run the same state with backoff", a: 0, w: "Retry with IntervalSeconds and BackoffRate." },
      { p: "Route to a cleanup state after a failure", a: 1, w: "Catch." },
      { p: "Same step for every item in a list", a: 2, w: "Map." },
      { p: "Different branches at the same time", a: 3, w: "Parallel." },
      { p: "Pause for a number of seconds", a: 4, w: "Wait." },
      { p: "Wait until a Glue job finishes", a: 5, w: "The .sync integration pattern." },
      { p: "Pause until a human approves through a callback", a: 6, w: "Task token." },
      { p: "Distributed mode for millions of S3 objects", a: 2, w: "Distributed Map." }
    ]
  },
  {
    id: "file-formats", title: "File formats",
    labels: ["Parquet", "ORC", "Avro", "JSON", "CSV"],
    items: [
      { p: "Columnar, the default choice for Athena, Spectrum and Spark", a: 0, w: "Parquet." },
      { p: "Columnar format strong in Hive workloads", a: 1, w: "ORC." },
      { p: "Row-based with the schema embedded, common for Kafka", a: 2, w: "Avro." },
      { p: "Nested, semi-structured, readable and verbose", a: 3, w: "JSON." },
      { p: "Simple text with no types, the most to scan", a: 4, w: "CSV." },
      { p: "Best when reading a few columns of billions of rows", a: 0, w: "Columnar formats skip unused columns." },
      { p: "Supports schema evolution for streaming records", a: 2, w: "Avro with a schema registry." }
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
  },
  {
    id: "logs-opensearch", title: "App logs into searchable dashboards", d: 2,
    story: "An application writes JSON logs on many servers. Operations wants them searchable with dashboards within a few minutes, DEBUG lines dropped, the recent week fast, and older logs cheaper but still searchable for a year. Documents that fail to index must be kept for review.",
    stages: [
      { name: "Collect and deliver", o: ["Kinesis Data Streams with a KCL application on EC2", "Firehose to OpenSearch with a Lambda transform and S3 backup for failed documents", "Firehose to S3 only", "SQS with a Lambda writer"], a: 1, w: "Firehose delivers to OpenSearch, the transform drops DEBUG, and failed documents go to S3." },
      { name: "Age out cheaply", o: ["A cron job that deletes old indexes", "Bigger hot instances", "Index State Management moving indexes to UltraWarm and then cold", "Snapshots to S3 restored on request"], a: 2, w: "ISM tiers older indexes to cheaper storage that stays searchable." },
      { name: "Dashboards", o: ["OpenSearch Dashboards", "Athena console", "CloudWatch dashboards", "A spreadsheet export"], a: 0, w: "Dashboards ship with OpenSearch and read the indexes directly." }
    ],
    r: "Firehose to OpenSearch with S3 backup, ISM for tiering, OpenSearch Dashboards for visuals."
  },
  {
    id: "cdc-iceberg", title: "Database mirror in the lake with deletes", d: 1,
    story: "An RDS for MySQL orders database must be mirrored into an S3 lake every hour, including updates and deletes, for Athena. Analysts also need to query the table as it was at the end of last month. The team is small.",
    stages: [
      { name: "Capture changes", o: ["A Glue JDBC job filtering on updated_at", "Nightly snapshot exports", "DMS with full load plus CDC writing Parquet to S3", "A Lambda function reading the binlog"], a: 2, w: "CDC carries inserts, updates and deletes with an operation column." },
      { name: "Apply them to the lake table", o: ["A Glue job that merges changes into an Iceberg table", "Athena INSERT statements only", "Overwriting the whole table each hour", "A Lambda function per change record"], a: 0, w: "Iceberg supports MERGE for updates and deletes." },
      { name: "Query last month's state", o: ["Redshift Spectrum with manual snapshots", "Athena on the Iceberg table with time travel", "DynamoDB with PartiQL", "EMR with HBase"], a: 1, w: "Iceberg snapshots allow FOR TIMESTAMP AS OF queries." }
    ],
    r: "DMS CDC for changes including deletes, Iceberg MERGE to apply them, Athena time travel for history."
  },
  {
    id: "saas-dashboard", title: "Salesforce to executive dashboard", d: 1,
    story: "Sales data lives in Salesforce. Executives want a dashboard each morning on a warehouse that is loaded nightly with no code to maintain. Dashboards must open fast, and each executive must see only their own region.",
    stages: [
      { name: "Extract", o: ["A Glue Spark job calling the API", "AppFlow scheduled flow to S3", "DMS", "A Lambda function polling the API"], a: 1, w: "AppFlow is the managed connector for SaaS sources." },
      { name: "Load the warehouse", o: ["A COPY job (auto-copy) from the S3 prefix into Redshift", "Row-by-row inserts over JDBC", "A Spectrum external table only", "An hourly Lambda that runs COPY"], a: 0, w: "Auto-copy loads new files once without code." },
      { name: "Dashboard", o: ["The Athena console", "QuickSight with SPICE", "A Grafana server on EC2", "Spreadsheet exports"], a: 1, w: "SPICE gives fast in-memory dashboards." },
      { name: "Limit rows per executive", o: ["A dashboard per region", "A Redshift view per region", "Row-level security with a permissions dataset", "An IAM policy per executive"], a: 2, w: "QuickSight row-level security filters rows per viewer." }
    ],
    r: "AppFlow extracts SaaS data, auto-copy loads Redshift, SPICE serves it, row-level security restricts it."
  },
  {
    id: "nas-to-lake", title: "On-premises NAS into a governed lake", d: 1,
    story: "A manufacturer has 40 TB on an NFS share and a 1 Gbps internet link. New files appear daily. Everything must reach S3 with integrity checks, be catalogued for Athena without long crawls, and move to cheaper storage as it ages.",
    stages: [
      { name: "Transfer", o: ["A cron job running aws s3 cp", "AWS Transfer Family", "A DataSync agent with a scheduled task", "Snowball Edge for the daily files"], a: 2, w: "DataSync verifies integrity and supports incremental scheduled copies from NFS." },
      { name: "Catalog", o: ["A crawler set to crawl new sub-folders only", "Hand-written tables", "DMS", "Macie"], a: 0, w: "Incremental crawls keep run time short for stable layouts." },
      { name: "Age out", o: ["A nightly Lambda that moves objects", "S3 lifecycle rules to colder storage classes", "EBS snapshots", "Manual review each quarter"], a: 1, w: "Lifecycle rules transition objects by age with no code." }
    ],
    r: "DataSync for NFS to S3, incremental crawler for the catalog, lifecycle rules for aging."
  },
  {
    id: "sftp-validate", title: "Partner SFTP files, validated and loaded", d: 1,
    story: "Partners send CSV files by SFTP. Each file must be validated against quality rules and loaded if it passes. The data team must be told when a file fails. Nothing should poll for new files.",
    stages: [
      { name: "Receive", o: ["Transfer Family SFTP into S3", "An EC2 SFTP server", "API Gateway", "DataSync"], a: 0, w: "Managed SFTP endpoint backed by S3." },
      { name: "Start processing", o: ["A Lambda function that runs every minute", "An EventBridge rule on object creation starting a state machine", "A scheduled crawler", "An SNS email"], a: 1, w: "Event-driven start without polling." },
      { name: "Validate and load", o: ["A Lambda function with regular expressions", "An EMR cluster", "A Glue job with an Evaluate Data Quality step", "A DataBrew profile only"], a: 2, w: "Glue Data Quality rules validate inside the ETL job." },
      { name: "Notify on failure", o: ["An EventBridge rule on the failure result sending to SNS", "A CPU alarm", "AWS Config", "A cron email script"], a: 0, w: "Event-driven notification on the result." }
    ],
    r: "Transfer Family receives, EventBridge triggers, Glue Data Quality validates, EventBridge plus SNS notifies."
  },
  {
    id: "redshift-archive", title: "Archive old Redshift data but keep it joinable", d: 2,
    story: "A Redshift cluster holds six years of sales. Only the last year is queried constantly. Older data must stay queryable at low cost, and reports must still combine old and new data in one query.",
    stages: [
      { name: "Move old rows out", o: ["UNLOAD as partitioned Parquet to S3", "Delete the rows", "COPY them to another cluster", "Take a snapshot"], a: 0, w: "UNLOAD exports to S3 in a columnar, partitioned layout." },
      { name: "Query old data", o: ["Athena only, outside Redshift", "RDS", "A Spectrum external table in the Data Catalog", "DynamoDB"], a: 2, w: "Spectrum queries S3 data from inside Redshift." },
      { name: "Combine hot and cold", o: ["Merge the results in the application", "A late-binding view that UNION ALLs the local and external tables", "Copy the old rows back", "A materialized view over the external table only"], a: 1, w: "A late-binding view can include external tables and presents one table to reports." },
      { name: "Cut S3 cost", o: ["Lifecycle to Glacier Flexible Retrieval", "Lifecycle to Deep Archive", "Lifecycle to Standard-IA or Intelligent-Tiering", "Delete after a year"], a: 2, w: "Spectrum cannot read objects in Glacier Flexible Retrieval or Deep Archive." }
    ],
    r: "UNLOAD to partitioned Parquet, Spectrum external table, late-binding UNION view, no Glacier tiers Spectrum cannot read."
  },
  {
    id: "pii-governed-lake", title: "Find, mask and restrict PII", d: 4,
    story: "Customer files with PII land in S3. Compliance wants to know where PII sits, sensitive columns hashed on the way into the curated zone, and analysts allowed to query curated data without seeing the SSN or salary columns. New PII arriving in the wrong bucket must raise an alert.",
    stages: [
      { name: "Discover PII in buckets", o: ["AWS Config rules", "Amazon Macie sensitive data discovery", "IAM Access Analyzer", "CloudTrail"], a: 1, w: "Macie classifies sensitive data in S3." },
      { name: "Hash on the way in", o: ["A Lambda function with regular expressions", "An Athena view", "A Glue job using the Detect Sensitive Data transform", "S3 lifecycle rules"], a: 2, w: "Detection and hashing inside the ETL job." },
      { name: "Hide the columns", o: ["Lake Formation column permissions", "An S3 bucket policy", "A security group", "An SCP"], a: 0, w: "Column-level control on catalog tables." },
      { name: "Alert on new findings", o: ["A CPU alarm", "AWS Budgets", "An EventBridge rule on Macie findings sending to SNS", "Trusted Advisor"], a: 2, w: "Macie publishes findings as events." }
    ],
    r: "Macie discovers, Glue hashes, Lake Formation restricts columns, EventBridge and SNS alert."
  },
  {
    id: "cross-account-lake", title: "Share curated tables across accounts", d: 4,
    story: "A producer account publishes curated tables. Analysts in a consumer account must query them in Athena and see only non-sensitive columns. The data is encrypted with a customer managed KMS key. Nothing may be copied.",
    stages: [
      { name: "Share the tables", o: ["Bucket replication to the consumer", "Pre-signed URLs", "Lake Formation cross-account grants with column permissions", "A crawler in the consumer account"], a: 2, w: "Grants carry the column restrictions without copying data." },
      { name: "Make them queryable by name", o: ["Resource links in the consumer's Data Catalog", "Copying table definitions by hand", "Athena federated query", "Views in the producer account"], a: 0, w: "Resource links point at the shared tables." },
      { name: "Allow decryption", o: ["Switch the data to SSE-S3", "Allow the consumer role in the key policy for decryption", "Share the key material", "Turn off encryption"], a: 1, w: "The customer managed key must allow the consumer principal to decrypt." }
    ],
    r: "Lake Formation grants, resource links in the consumer, KMS key policy for the consumer role."
  },
  {
    id: "enrich-stream-dynamodb", title: "Enrich payments in-stream", d: 1,
    story: "Payment events arrive continuously. Each must be enriched with merchant details and written to S3 as Parquet within minutes. Events that cannot be enriched must be kept for review. The team wants few moving parts.",
    stages: [
      { name: "Ingest, enrich and deliver", o: ["SQS with a Lambda writer", "A Glue batch job every hour", "Kinesis Data Streams with a KCL application on EC2", "Firehose with a Lambda transform and Parquet conversion"], a: 3, w: "Firehose transforms, converts and delivers with no servers." },
      { name: "Merchant lookup store", o: ["Athena queries for each event", "Redshift queries for each event", "DynamoDB keyed by merchant ID, with DAX for hot merchants", "An S3 object per merchant read every time"], a: 2, w: "Key-value lookups in milliseconds, microseconds with DAX." },
      { name: "Events that fail enrichment", o: ["A Lambda dead-letter queue", "ProcessingFailed with an S3 error output prefix", "Return Dropped", "Email each failure"], a: 1, w: "Failed records land under the Firehose error prefix." }
    ],
    r: "Firehose + Lambda transform for in-stream enrichment, DynamoDB lookups, ProcessingFailed to S3 error prefix."
  },
  {
    id: "ml-feature-prep", title: "Training data and reusable features", d: 3,
    story: "Data scientists need a clean training dataset from raw CSVs in S3, and features that can be reused for both batch training and low-latency inference.",
    stages: [
      { name: "Prepare visually", o: ["SageMaker Data Wrangler", "A Glue crawler", "An Athena view", "A Lambda function"], a: 0, w: "Data Wrangler is the visual data preparation tool for ML." },
      { name: "Store the features", o: ["DynamoDB only", "SageMaker Feature Store with online and offline stores", "S3 CSV files only", "RDS"], a: 1, w: "Feature Store serves both uses from one definition." },
      { name: "Low-latency inference lookups", o: ["The offline store", "Athena queries", "The online store", "The Glue Data Catalog"], a: 2, w: "The online store answers single-record lookups quickly." },
      { name: "Build the training set", o: ["The online store", "The offline store in S3, queried with Athena", "A Lambda function", "EC2 scripts"], a: 1, w: "The offline store keeps history in S3 for batch use." }
    ],
    r: "Data Wrangler prepares, Feature Store online for inference, offline for training."
  },
  {
    id: "bank-audit-trail", title: "Tamper-evident audit trail across accounts", d: 4,
    story: "A bank needs a tamper-evident record of API activity across 40 accounts that can be queried with SQL for three years, an alert when a bucket policy changes, and proof that S3 default encryption stayed enabled.",
    stages: [
      { name: "Record API activity", o: ["VPC Flow Logs", "An organization CloudTrail trail with log file validation", "CloudWatch metrics", "AWS Config"], a: 1, w: "CloudTrail records API calls, and validation proves integrity." },
      { name: "SQL over three years", o: ["Athena tables built in every account", "CloudWatch Logs Insights", "OpenSearch", "A CloudTrail Lake event data store"], a: 3, w: "CloudTrail Lake stores events centrally with SQL queries." },
      { name: "Alert on bucket policy changes", o: ["An EventBridge rule on the PutBucketPolicy call sending to SNS", "A CPU alarm", "AWS Budgets", "Macie"], a: 0, w: "Management API calls arrive as events." },
      { name: "Prove encryption stayed on", o: ["Cost Explorer", "CloudTrail alone", "AWS Config rule and configuration history", "Inspector"], a: 2, w: "Config shows configuration over time and compliance." }
    ],
    r: "CloudTrail for who, CloudTrail Lake for SQL, EventBridge for alerts, Config for configuration proof."
  },
  {
    id: "rate-limited-api", title: "Rate-limited API into a warehouse", d: 1,
    story: "A nightly job must pull about 400 pages from a third-party REST API limited to five concurrent calls, keep the raw JSON, convert it to Parquet and load a warehouse. Failures must retry automatically, and the team must be alerted if the run fails.",
    stages: [
      { name: "Make the calls", o: ["An SNS fan-out to many Lambda functions", "Step Functions Map with MaxConcurrency 5 and Retry with backoff", "An EC2 script in cron", "Unbounded parallel Lambda invocations"], a: 1, w: "Concurrency is capped in the workflow and retries are built in." },
      { name: "Land raw data", o: ["Lambda writing JSON to S3 under a date prefix", "Writing to RDS", "DynamoDB", "EFS"], a: 0, w: "S3 is the cheap, durable raw zone." },
      { name: "Convert to Parquet", o: ["A Glue ETL job", "A Lambda per page", "A DataBrew dataset only", "An always-on EMR cluster"], a: 0, w: "Serverless Spark for the conversion." },
      { name: "Alert on failure", o: ["A CloudTrail trail", "An EventBridge rule on the state machine's failed status sending to SNS", "AWS Config", "A CloudWatch billing alarm"], a: 1, w: "Execution status change events trigger notifications." }
    ],
    r: "Map with MaxConcurrency and Retry for throttled APIs, S3 raw zone, Glue conversion, EventBridge plus SNS alert."
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
  { s: "Get logs into S3 as Parquet, partitioned by customer, within minutes.", o: "Firehose delivers raw JSON, and a nightly Glue job converts it to Parquet.", reqs: ["Parquet output", "Partitioned by customer", "Available within minutes"], a: 2, w: "Parquet only appears after the nightly job." },
  { s: "Notify the team whenever any Glue job fails or times out, without polling.", o: "A CloudWatch alarm on the glue.driver.aggregate.numFailedTasks metric.", reqs: ["Notifies the team", "No polling", "Covers jobs that time out"], a: 2, w: "A timeout does not necessarily raise failed-task counts. An EventBridge rule on job state change covers FAILED and TIMEOUT." },
  { s: "A fraud dashboard on Redshift must show Kinesis events within seconds.", o: "Firehose delivers to S3 every five minutes and a scheduled COPY loads the files.", reqs: ["Data comes from Kinesis", "Visible within seconds", "Dashboard queries Redshift"], a: 1, w: "Buffered delivery plus a scheduled load takes minutes. Streaming ingestion reads the stream directly." },
  { s: "Archive Redshift sales older than a year to S3, but keep them queryable from Redshift.", o: "UNLOAD the old rows as Parquet, then transition them to Glacier Flexible Retrieval after 30 days.", reqs: ["Old data lives in S3", "Still queryable with Spectrum", "Cheaper storage"], a: 1, w: "Spectrum cannot read objects in Glacier Flexible Retrieval or Deep Archive." },
  { s: "A crawler must add new daily partitions quickly and also register columns that partners add over time.", o: "Set the crawler to crawl new sub-folders only.", reqs: ["New partitions found quickly", "New columns added to the table", "Uses a crawler"], a: 1, w: "Incremental crawls only log schema changes. They add partitions, not new columns." },
  { s: "Limit a Lambda function reading SQS to ten concurrent invocations without sending healthy messages to the dead-letter queue.", o: "Set the function's reserved concurrency to 10.", reqs: ["At most ten concurrent invocations", "Healthy messages are not dead-lettered", "Works with SQS"], a: 1, w: "Throttled invocations use up receive attempts, so messages can be dead-lettered. Use maximum concurrency on the mapping." },
  { s: "A partner in another account must read SSE-KMS encrypted objects while key usage stays auditable.", o: "Encrypt with the AWS managed key aws/s3 and add the partner to the bucket policy.", reqs: ["Partner can decrypt and read", "Encryption stays KMS-based and audited", "Cross-account access"], a: 0, w: "AWS managed keys cannot be shared across accounts, so decryption is denied. Use a customer managed key." },
  { s: "Support agents must see the last four digits of a card number and finance the full value, from one Redshift table.", o: "A column-level GRANT on card_number to the finance role only.", reqs: ["Finance sees the full value", "Support sees the last four digits", "One table"], a: 1, w: "A column grant shows or hides the whole column. Dynamic data masking shows part of it." },
  { s: "Keep S3 records unchangeable for seven years, even against administrators.", o: "S3 Object Lock in governance mode with a seven-year retention.", reqs: ["Seven-year retention", "Unchangeable during retention", "Holds even against administrators"], a: 2, w: "Users with the bypass permission can override governance mode. Compliance mode cannot be bypassed." },
  { s: "Query a DynamoDB table with Athena without using the table's read capacity.", o: "Athena federated query with the DynamoDB connector.", reqs: ["Queried with Athena SQL", "Uses no table read capacity", "Reads the data"], a: 1, w: "The connector reads the live table and consumes capacity. Export to S3 avoids it." },
  { s: "A Glue job must process only new files from S3 on each run without custom tracking code.", o: "Run a crawler before every job run.", reqs: ["Only new files are processed", "No custom tracking code", "Runs inside Glue"], a: 0, w: "A crawler updates metadata. It does not stop the job from rereading old files. Job bookmarks do." },
  { s: "A Glue job must read only yesterday's partition of a five-year catalog table.", o: "Read the whole table with from_catalog, then filter on dt with a lambda.", reqs: ["Result holds only yesterday's data", "Only that partition is read", "Uses the Data Catalog table"], a: 1, w: "Filtering after the read still lists and loads every partition. A push_down_predicate prunes first." },
  { s: "Run SQL against Redshift from Lambda using the role's credentials, with no connection kept open.", o: "Open a JDBC connection from the function using temporary IAM credentials.", reqs: ["Uses the role's credentials, no stored password", "No connection kept open", "Runs from Lambda"], a: 1, w: "JDBC needs a live connection. The Redshift Data API is asynchronous and connectionless." },
  { s: "A consumer must be able to replay the last seven days of Kinesis events.", o: "Create a stream with default settings and read it with Lambda.", reqs: ["Lambda processes the events", "Seven days can be replayed", "Records are durable"], a: 1, w: "Default retention is 24 hours. Raise the retention period to seven days." },
  { s: "Deliver streaming JSON to S3 as Parquet partitioned by customer ID within minutes, without code.", o: "Firehose with record format conversion to Parquet, delivering under a single prefix.", reqs: ["Parquet output", "Partitioned by customer ID", "No code"], a: 1, w: "Without dynamic partitioning on the customer field, all output lands under one prefix." },
  { s: "Move a 5 TB PostgreSQL database to Aurora PostgreSQL with only minutes of downtime.", o: "AWS DMS with full load only, then cut over.", reqs: ["Target is Aurora PostgreSQL", "Only minutes of downtime", "Data copied completely"], a: 1, w: "Changes made during and after the full load are missed. CDC keeps the target in sync until cutover." },
  { s: "Cut Athena cost for 20 TB of CSV, where queries filter on event date and read 4 of 60 columns.", o: "Partition the CSV files by event date.", reqs: ["Skips irrelevant dates", "Reads only the four needed columns", "Lower bytes scanned"], a: 1, w: "Partitioning prunes dates, but CSV is row-based so every column is still read. Parquet fixes that." },
  { s: "Share a Redshift table with another account's cluster without leaving a copy to maintain.", o: "Take a snapshot and restore it in the other account each night.", reqs: ["The other account can query it", "No copy to maintain", "Runs on Redshift"], a: 1, w: "A restored snapshot is a copy. A datashare gives live access with no copy." },
  { s: "Partners push files by SFTP and allow-list the company's IP address in their firewalls.", o: "AWS Transfer Family SFTP server on a public endpoint.", reqs: ["SFTP lands files in S3", "Fixed IPs partners can allow-list", "No servers to manage"], a: 1, w: "Public endpoint addresses are not fixed. A VPC endpoint with Elastic IPs gives stable ones." },
  { s: "Alert the on-call team when CPU stays above 85 percent for ten minutes.", o: "An AWS Config rule that checks CPU utilization.", reqs: ["Based on a metric threshold", "Sustained for ten minutes", "Notifies the team"], a: 0, w: "Config evaluates configuration compliance, not performance metrics. CloudWatch alarms do." },
  { s: "Find out which IAM user changed a security group last week.", o: "AWS Config configuration history.", reqs: ["Shows that the change happened", "Identifies the IAM user who made it", "Covers last week"], a: 1, w: "Config shows what changed. CloudTrail shows who made the call." },
  { s: "Load partner files that arrive all day into a Redshift table automatically, each exactly once.", o: "A Spectrum external table over the S3 prefix.", reqs: ["New files appear automatically", "Each file is loaded into Redshift", "No code to write"], a: 1, w: "Spectrum queries the files in place. Nothing is loaded. Auto-copy loads each new file once." },
  { s: "Pause a Step Functions workflow until a person approves, then continue.", o: "Run the approval task with the .sync integration pattern.", reqs: ["The workflow waits", "A human approval can signal back", "The workflow then continues"], a: 1, w: ".sync waits for an AWS job to finish. Human callbacks use .waitForTaskToken." },
  { s: "A QuickSight user must see only their own region's rows from a SPICE dataset.", o: "Apply Lake Formation row filters on the source table.", reqs: ["Rows filtered per viewer", "Works for data imported into SPICE", "Little maintenance"], a: 1, w: "SPICE holds an imported copy, so source-side filters do not apply. Use dataset row-level security." },
  { s: "Lower the Glue bill for a non-urgent nightly job whose size never changes.", o: "Enable auto scaling with a lower maximum worker count.", reqs: ["Lower price per DPU-hour", "Same job every night", "No code changes"], a: 0, w: "Auto scaling does not change the price per DPU-hour, and a constant load gains little. Flex does." },
  { s: "Convert 300 small CSV files per hour (each under 100 MB) to Parquet at the lowest cost, with no servers.", o: "Start a Glue Spark job with ten G.1X workers for each file.", reqs: ["Parquet output", "Lowest cost for small files", "No servers to manage"], a: 1, w: "A Spark job per small file is expensive. A Lambda function or one batched job costs far less." },
  { s: "Reduce Athena cost for queries that always filter on a single customer.", o: "Partition the table by timestamp.", reqs: ["Skips other customers' data", "Partition matches the filter", "Queried with SQL"], a: 1, w: "Partitioning only helps when it follows the filter column. This one partitions on time." },
  { s: "Run a two-hour, 9 GB containerized validation job on demand with no idle servers.", o: "Package the job as a Lambda container image.", reqs: ["Supports container images", "Runs for two hours", "Fits within the memory"], a: 1, w: "Lambda stops at 15 minutes. AWS Batch fits long containers." },
  { s: "Replicate new S3 objects to another Region and include the 50 TB that already exists.", o: "Enable a replication rule on the versioned bucket.", reqs: ["New objects replicate", "Existing objects replicate", "Copy goes to another Region"], a: 1, w: "A rule applies to new objects. S3 Batch Replication copies the existing ones." },
  { s: "Let Glue jobs in a private subnet write to S3 at the lowest cost, with no public IPs on workers.", o: "Add a NAT gateway in a public subnet.", reqs: ["Reaches S3", "Lowest cost", "No public IPs on workers"], a: 1, w: "NAT charges per hour and per GB. An S3 gateway endpoint is free." },
  { s: "Find sensitive data in a landing bucket, then hash the sensitive columns.", o: "Run Amazon Macie on the landing bucket.", reqs: ["Detects card numbers in the files", "Hashes the detected columns", "Reports findings"], a: 1, w: "Macie discovers and reports. It does not transform data. Use a Glue sensitive data transform to hash." }
];

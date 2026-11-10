// DEA-C01 situational question bank.
// Fields: id, d (domain 1-4), t (topic), q (stem), o (options), r (one-line rule).
// Option helper O(text, isCorrect, whyShownAfterAnswering). More than one correct option = multi-select.
const O = (t, c, w) => ({ t: t, c: !!c, w: w });

const QUESTIONS = [
  {
    id: "glue-dq-pipeline", d: 1, t: "Glue",
    q: "A company receives daily CSV files from several business partners in an Amazon S3 landing bucket. Analysts use Amazon Athena, through the AWS Glue Data Catalog, to build weekly reports for regional managers. Partners sometimes change their file layouts without warning. Over the last month, analysts have reported query errors and missing columns. Last week, a report included rows with no customer ID and several malformed email addresses, which caused complaints. The company's security team has asked to be told when bad data arrives. The data engineering team is small and wants to avoid managing infrastructure. Which solution should the data engineer implement with the LEAST operational overhead?",
    o: [
      O("Use a Lambda function to validate each file and start a Glue crawler. Notify the security team by using Amazon SNS.", false, "Works, but you write and maintain the validation code, and Lambda limits make large files awkward. More to operate than managed Glue features."),
      O("Use AWS Glue DataBrew to profile the files on a schedule. Use a Glue crawler to update the table. Use an Amazon CloudWatch alarm on failed job runs to notify the security team.", false, "Profiling reports problems but does not keep invalid rows out of the curated data. An alarm on failed job runs does not report bad rows."),
      O("Use an Amazon EMR cluster to run a Spark job that validates the files. Use a Glue crawler to update the table. Use AWS Step Functions to notify the security team.", false, "Meets the needs, but you operate an EMR cluster. That is the most overhead of the four."),
      O("Use a Glue crawler to update the table. Use a Glue job with Glue Data Quality rules to separate invalid rows. Use Amazon EventBridge to send failed results to Amazon SNS.", true, "A crawler keeps the schema current, Glue Data Quality rules separate invalid rows, and an EventBridge rule on the results notifies through SNS. All managed.")
    ],
    r: "Schema drift: crawler. Row-level validation: Glue Data Quality. React to results: EventBridge rule, not polling."
  },
  {
    id: "glue-bookmarks", d: 1, t: "Glue",
    q: "A nightly AWS Glue Spark job reads daily files from an S3 prefix, transforms them, and appends the results to a curated table. The prefix grows every day, and the job now takes much longer than it did a month ago, even though each day brings about the same amount of new data. The team does not want to write code to track which files were already processed. What should the data engineer do to reduce runtime with the LEAST effort?",
    o: [
      O("Run a Glue crawler before each job run so the Data Catalog is current.", false, "A crawler updates table metadata. It does not stop the job from rereading files it already processed."),
      O("Enable job bookmarks for the job.", true, "Bookmarks keep state between runs, so each run reads only new data. No custom tracking code."),
      O("Add a partition index to the catalog table.", false, "Partition indexes speed up partition lookups. They do not track which data a job already handled."),
      O("Increase the number of DPUs and turn on auto scaling.", false, "The job finishes faster but still reprocesses everything, so you pay more to repeat the same work.")
    ],
    r: "Process only new data each run, no custom tracking: job bookmarks."
  },
  {
    id: "glue-crawler-schema", d: 2, t: "Glue",
    q: "A partner delivers JSON files to an S3 bucket every day, and the files sometimes contain new fields. Analysts query the data through Athena, but new fields do not show up in query results until an engineer updates the table by hand. Files are stored in daily prefixes (year/month/day). The company wants new fields and new daily partitions to appear without manual work and with the LEAST operational overhead. Which solution meets these requirements?",
    o: [
      O("Run a Glue ETL job that rewrites every file to a fixed schema before analysts query it.", false, "A fixed schema breaks again the next time a partner adds fields, and the job is extra work to build and run."),
      O("Define partition projection on the table.", false, "Projection finds new partitions without registering them, but it does not add new columns to the table schema."),
      O("Schedule a Glue crawler that updates the existing table definition when the schema changes and adds new partitions.", true, "The crawler handles both new columns and new partitions automatically."),
      O("Ask partners to announce changes and run ALTER TABLE ADD COLUMNS in Athena each time.", false, "Works, but it is exactly the manual process the company wants to remove.")
    ],
    r: "New columns and new partitions, automatically: scheduled crawler set to update the table definition."
  },
  {
    id: "sfn-multi-service", d: 1, t: "Orchestration",
    q: "A data pipeline runs a Glue job, then a step on Amazon EMR, then a Lambda function that updates a DynamoDB table. If the EMR step fails because of a temporary capacity issue, the pipeline should retry a few times with increasing waits, and after the final failure an alert should go out. The team wants a managed way to run the sequence without writing orchestration code. Which solution has the LEAST operational overhead?",
    o: [
      O("Use Amazon MWAA with a DAG for the sequence.", false, "Can do all of it, but you run an Airflow environment and write DAG code. More overhead than Step Functions here."),
      O("Create a Glue workflow with triggers for each step.", false, "Glue workflows orchestrate Glue crawlers and jobs. They cannot run EMR steps or Lambda functions as workflow nodes."),
      O("Chain Amazon EventBridge rules so each step's completion event starts the next step.", false, "Possible, but you build the state tracking, retries and failure handling yourself."),
      O("Use AWS Step Functions with Retry and backoff on the EMR task and a Catch that publishes to Amazon SNS.", true, "Native sequencing across services, built-in retry with backoff, and Catch for the final failure.")
    ],
    r: "Cross-service sequence with retries and failure handling: Step Functions. Glue workflows are Glue-only."
  },
  {
    id: "databrew-analysts", d: 3, t: "Glue",
    q: "A group of business analysts with no programming experience receives customer CSV files with inconsistent date formats and missing values. They want to explore the data quality, clean the files, and write the cleaned files to S3 every morning. The company wants the analysts to do this themselves with the LEAST development effort. Which solution should the company use?",
    o: [
      O("Build a visual ETL job in AWS Glue Studio and run it with a scheduled trigger.", false, "Visual, but built around ETL job authoring and Spark concepts, with no dataset profiling like DataBrew. Needs more skill than the analysts have."),
      O("Use Amazon Athena CTAS queries scheduled with Amazon EventBridge.", false, "Requires writing SQL, which the analysts cannot do, and gives no profiling."),
      O("Build a recipe in AWS Glue DataBrew, profile the dataset, and schedule a DataBrew job.", true, "No-code recipes, built-in data profiling, and scheduling."),
      O("Create an Amazon SageMaker Data Wrangler flow.", false, "Designed for preparing machine learning features inside SageMaker. It adds a service the analysts do not need.")
    ],
    r: "No-code cleaning plus profiling plus schedule: Glue DataBrew."
  },
  {
    id: "kinesis-streams-firehose", d: 1, t: "Kinesis",
    q: "A mobile app sends about 10,000 events per second. A fraud team needs to process each event within a second using custom logic, and must be able to reprocess the last three days of events after fixing bugs. A separate analytics team wants the same raw events in S3 as Parquet. The company wants the LEAST operational overhead. Which solution meets these requirements?",
    o: [
      O("Send events to Amazon SNS. Use one SQS queue for the fraud team and another queue feeding a Lambda function that writes to S3.", false, "SQS messages are deleted after processing, so nothing can be replayed from three days ago. Also more glue code."),
      O("Send events to Amazon MSK. Both teams run their own consumers.", false, "Meets the needs, but you build and run more yourself: consumers and the S3 delivery."),
      O("Send events to Amazon Kinesis Data Firehose, which delivers to S3. The fraud team queries S3 with Athena.", false, "Firehose buffers and delivers to storage. Querying S3 cannot meet one-second processing, and there is no stream to replay."),
      O("Send events to Kinesis Data Streams with 3-day retention. The fraud team consumes with Managed Service for Apache Flink. A Firehose stream reads from the data stream and delivers Parquet to S3.", true, "Streams gives low latency, multiple consumers and replay. Firehose handles the Parquet delivery with no code.")
    ],
    r: "Multiple consumers plus replay: Kinesis Data Streams. Delivery to S3 without code: Firehose reading from the stream."
  },
  {
    id: "lambda-kinesis-throughput", d: 1, t: "Kinesis",
    q: "A Lambda function consumes a Kinesis data stream with 4 shards. During peak hours the IteratorAgeMilliseconds metric keeps rising and the function cannot keep up. The shard count must not change. Which TWO actions should the data engineer take to increase read and processing throughput?",
    o: [
      O("Increase provisioned concurrency for the function.", false, "Pre-warms environments to cut cold starts. It does not change how many batches are processed per shard."),
      O("Raise the parallelization factor on the event source mapping.", true, "Lets Lambda process up to 10 batches per shard concurrently."),
      O("Increase reserved concurrency for the function.", false, "Reserved concurrency is a cap or reservation. It does not make Lambda read the stream faster."),
      O("Switch the stream to on-demand capacity mode.", false, "Changes write capacity scaling, not consumer lag, and it can change the shard count the team wants fixed."),
      O("Register the function as an enhanced fan-out consumer.", true, "Gives the consumer its own dedicated read throughput per shard.")
    ],
    r: "Lagging Kinesis-to-Lambda consumer: parallelization factor, enhanced fan-out, or more shards. Not reserved or provisioned concurrency."
  },
  {
    id: "redshift-datashare", d: 2, t: "Redshift",
    q: "A company's marketing department runs its own AWS account and wants to analyze a few tables that live in the data engineering team's Redshift cluster. The analysis must use current data, the tables must not be copied, and the marketing queries must not slow down the production cluster. Marketing queries run only a few hours each week. Which solution is the MOST cost-effective?",
    o: [
      O("Unload the tables to S3 nightly and query them with Redshift Spectrum from the marketing account.", false, "The data is a day old, it is copied into S3, and you pay for storage and scans."),
      O("Restore a nightly snapshot into a provisioned cluster in the marketing account.", false, "A stale copy, and a cluster that runs all week for a few hours of use."),
      O("Give marketing a federated query connection to the production cluster.", false, "Federated queries are for RDS and Aurora sources, and the work would run on the production cluster."),
      O("Share the tables with a Redshift datashare to the marketing account, which queries them from Amazon Redshift Serverless.", true, "Live data with no copy, separate compute for marketing, and pay-per-use for the occasional workload.")
    ],
    r: "Live Redshift-to-Redshift access without copying: data sharing. Intermittent consumer: Redshift Serverless."
  },
  {
    id: "athena-cost-multi", d: 3, t: "Athena",
    q: "Analysts run Athena queries over 20 TB of gzip-compressed CSV clickstream files in S3. Almost every query filters on event date and reads 4 of 60 columns. Query costs are climbing. Which TWO changes reduce cost the MOST?",
    o: [
      O("Turn on query result reuse.", false, "Helps only when the same query is run again. These queries vary."),
      O("Partition the data by event date.", true, "Queries that filter on date scan only the matching partitions."),
      O("Recompress the files with bzip2.", false, "Compression format does not let Athena skip columns or partitions."),
      O("Convert the files to Apache Parquet.", true, "Columnar storage lets Athena read only the 4 columns needed."),
      O("Split each file into many smaller gzip files.", false, "Many small files add overhead, and the data is still row-based.")
    ],
    r: "Athena cost is bytes scanned: Parquet plus partitioning are the main levers."
  },
  {
    id: "s3-lifecycle-logs", d: 2, t: "S3",
    q: "A company stores application logs in S3. Analysts query the logs with Athena for the first 60 days. After that, the logs are rarely read, but when needed they must be available within minutes for up to one year. After one year the logs are kept only for audits, and retrieval within a few hours is acceptable. Logs must be deleted after seven years and cannot be recreated. Which lifecycle configuration is the MOST cost-effective?",
    o: [
      O("Transition to S3 One Zone-IA at 60 days and S3 Glacier Flexible Retrieval at 1 year. Expire at 7 years.", false, "One Zone-IA keeps data in a single Availability Zone, which is risky for logs that cannot be recreated."),
      O("Transition to S3 Glacier Deep Archive at 60 days. Expire at 7 years.", false, "Deep Archive retrieval takes about 12 hours, which fails the within-minutes requirement for the first year."),
      O("Store in S3 Intelligent-Tiering and enable the Deep Archive Access tier. Expire at 7 years.", false, "The access pattern is known, so lifecycle rules are cheaper, and archive tiers do not guarantee minutes."),
      O("Transition to S3 Standard-IA at 60 days and S3 Glacier Flexible Retrieval at 1 year. Expire at 7 years.", true, "Standard-IA is instant and cheaper for rare reads. Flexible Retrieval fits the audit tier where hours are fine.")
    ],
    r: "Match each age band to its retrieval need: Standard-IA for rare but instant, Glacier Flexible for hours, expire at the end."
  },
  {
    id: "sqs-dlq", d: 1, t: "Messaging",
    q: "A microservice processes order messages from an Amazon SQS standard queue. Occasionally a malformed message fails processing every time. The service keeps retrying it, and these retries slow down processing of healthy messages. The team wants failing messages set aside for later review while healthy messages keep flowing, with the LEAST effort. What should the data engineer do?",
    o: [
      O("Increase the queue's visibility timeout.", false, "Only delays when the failed message reappears. It will still fail every time."),
      O("Create a dead-letter queue and add a redrive policy with a maximum receive count.", true, "After the set number of failed receives, the message moves to the DLQ for later review."),
      O("Switch to a FIFO queue.", false, "FIFO preserves order and does not set failing messages aside."),
      O("Use a delay queue.", false, "Delays when messages first become visible. It does nothing about repeated failures.")
    ],
    r: "Poison messages that keep failing: DLQ with a redrive policy (maxReceiveCount)."
  },
  {
    id: "appflow-salesforce", d: 1, t: "Ingestion",
    q: "A company wants to load account and opportunity records from its Salesforce instance into an S3 data lake every night. The data engineering team is small and does not want to write or maintain extraction code. Which solution has the LEAST operational overhead?",
    o: [
      O("Write a Glue Spark job that calls the Salesforce API on a schedule.", false, "Workable, but you build, secure and maintain the extraction code."),
      O("Use AWS DMS to replicate from Salesforce to S3.", false, "DMS replicates databases. Salesforce is a SaaS application, not a supported source."),
      O("Run a Lambda function on an EventBridge schedule that pages through the Salesforce API.", false, "More custom code to write, with Lambda time limits on large pulls."),
      O("Create an Amazon AppFlow flow from Salesforce to S3 on a nightly schedule.", true, "AppFlow is the managed connector for SaaS sources. No code.")
    ],
    r: "SaaS application into AWS with no custom code: Amazon AppFlow."
  },
  {
    id: "apigw-data-api", d: 1, t: "API Gateway",
    q: "A company wants external partner applications to retrieve order status data that is stored in Amazon DynamoDB. Partners will call the data over HTTPS as a REST API. The company wants no servers to manage and needs to limit how many requests each partner can make. Which solution has the LEAST operational overhead?",
    o: [
      O("Run the API on EC2 instances behind an Application Load Balancer and implement throttling in the application.", false, "Servers to manage, and you build the throttling yourself."),
      O("Export the table to S3 daily and give each partner a pre-signed URL.", false, "Not a REST API, the data is a day old, and there are no per-partner request limits."),
      O("Create an API in Amazon API Gateway integrated with Lambda or DynamoDB, with a usage plan and API key for each partner.", true, "Serverless REST API with per-partner throttling through usage plans."),
      O("Put Amazon CloudFront in front of the DynamoDB table and rate-limit with AWS WAF.", false, "CloudFront does not turn a DynamoDB table into a REST API, and this does not give per-partner usage plans.")
    ],
    r: "Expose data as a serverless REST API with per-client throttling: API Gateway usage plans and API keys."
  },
  {
    id: "cloudtrail-who", d: 4, t: "Monitoring",
    q: "Last week the security group of an Amazon Redshift cluster was changed, and a database became reachable from the internet. The security team wants to find out which IAM user made the change and when. Which service should the data engineer use?",
    o: [
      O("AWS Config", false, "Shows that the configuration changed and what it looked like before and after, but identifying the caller is CloudTrail's job."),
      O("Amazon CloudWatch Logs Insights on the Redshift audit logs", false, "Redshift audit logs cover database activity, not account API calls such as security group changes."),
      O("VPC Flow Logs", false, "Records network traffic, not who changed a setting."),
      O("AWS CloudTrail event history", true, "CloudTrail records API calls with the user, time and parameters.")
    ],
    r: "Who made which API call, and when: CloudTrail."
  },
  {
    id: "cloudwatch-cpu-alarm", d: 3, t: "Monitoring",
    q: "A data engineer runs a production Amazon Redshift cluster. The on-call team wants to be paged if CPU utilization stays above 85 percent for ten minutes. Which solution has the LEAST operational overhead?",
    o: [
      O("Create an AWS Config rule that evaluates cluster utilization.", false, "Config checks configuration compliance, not performance numbers."),
      O("Create an Amazon CloudWatch alarm on the CPUUtilization metric with an SNS notification.", true, "Redshift already publishes the metric. An alarm with a threshold and period is exactly this."),
      O("Run a Lambda function every minute that queries system tables and publishes to SNS.", false, "Works, but it is custom code for something the existing metric already provides."),
      O("Use CloudTrail events with an EventBridge rule.", false, "CloudTrail records API calls, not CPU usage.")
    ],
    r: "Alert when a performance number crosses a threshold: CloudWatch alarm."
  },
  {
    id: "config-encryption-history", d: 4, t: "Monitoring",
    q: "A company's auditors want to be able to show, for any date, whether every S3 bucket had default encryption enabled, and when any bucket's encryption setting changed. The company wants this record to start now and keep running automatically. Which solution meets these requirements with the LEAST operational overhead?",
    o: [
      O("Use CloudTrail and write Athena queries for PutBucketEncryption events.", false, "Shows API calls, but not the state of every bucket or compliance over time. You would build the reporting yourself."),
      O("Use Amazon Macie to scan the buckets.", false, "Macie finds sensitive data. It does not report on bucket encryption settings over time."),
      O("Use IAM Access Analyzer.", false, "Reports on access shared outside the account, not encryption settings."),
      O("Enable AWS Config with a managed rule that checks S3 bucket encryption and use its configuration history.", true, "Config records configuration over time and evaluates it against the rule continuously.")
    ],
    r: "Configuration history and continuous compliance checks: AWS Config."
  },
  {
    id: "lakeformation-row-col", d: 4, t: "Lake Formation",
    q: "Regional sales managers query a customer table in Athena. Each manager must see only customers from their own region, and no manager may see the credit_limit column. The company wants the rules managed centrally and enforced for every query engine that reads the Glue Data Catalog table, with the LEAST operational overhead. Which solution meets these requirements?",
    o: [
      O("Create a separate table per region and use Glue Data Catalog resource policies.", false, "Duplicates data, and catalog policies work at table level, so the column is not hidden by them."),
      O("Create Lake Formation data filters with row and column restrictions and grant them to each manager's role.", true, "Row and column filters, managed centrally, enforced across integrated engines."),
      O("Write IAM policies that limit each manager to a different S3 prefix.", false, "S3 prefixes cannot hide a column, and it would require splitting the data by region."),
      O("Create an Athena view per region and grant access to the views.", false, "Views can filter, but they are per-region objects to maintain and are not central enforcement for other engines.")
    ],
    r: "Row and column level access on catalog tables, centrally: Lake Formation data filters."
  },
  {
    id: "firehose-parquet-partition", d: 1, t: "Kinesis",
    q: "Application servers write JSON logs. The company wants the logs in S3 within a few minutes as Parquet, organized by customer ID so Athena queries on one customer scan less data. The company does not want to manage servers or write conversion code. Which solution has the LEAST operational overhead?",
    o: [
      O("Send logs to Firehose delivering raw JSON to S3, and run a nightly Glue job that converts to Parquet partitioned by customer.", false, "Parquet only appears after the nightly job, not within a few minutes."),
      O("Send logs to Kinesis Data Streams and run a KCL application on EC2 that writes partitioned Parquet.", false, "Servers and consumer code to manage."),
      O("Send logs to Firehose with record format conversion to Parquet and dynamic partitioning on customer ID.", true, "Firehose does the conversion and partitioning itself and delivers near real time."),
      O("Invoke a Lambda function per log line that writes partitioned Parquet files to S3.", false, "Creates huge numbers of tiny files and is custom code to maintain.")
    ],
    r: "Near-real-time Parquet in S3, partitioned, no code: Firehose format conversion plus dynamic partitioning."
  },
  {
    id: "eventbridge-start-glue-workflow", d: 1, t: "Orchestration",
    q: "Partners upload files to an S3 bucket at unpredictable times. Each upload should start an existing AWS Glue workflow within moments, without polling. The team wants to write as little code as possible. Which solution meets these requirements?",
    o: [
      O("Schedule a Lambda function every minute that lists the bucket and starts the workflow.", false, "Polling, with code to maintain and a delay of up to a minute."),
      O("Send S3 object-created events to Amazon EventBridge and add a rule that starts the Glue workflow.", true, "Event-driven, no code, starts when the file arrives."),
      O("Run the Glue crawler every five minutes and start the workflow when it finds new files.", false, "Scheduled rather than event-driven, so there is a delay and unnecessary runs."),
      O("Send S3 event notifications to a Lambda function that calls StartWorkflowRun.", false, "Works, but you write and maintain a function that an EventBridge rule makes unnecessary.")
    ],
    r: "Start something when an event happens, with minimal code: EventBridge rule targeting it."
  },
  {
    id: "dms-homogeneous", d: 2, t: "Migration",
    q: "A company needs to move a 5 TB on-premises PostgreSQL database to Amazon Aurora PostgreSQL. The application can be offline for only a few minutes during cutover. The schemas and data types are compatible. Which solution meets these requirements?",
    o: [
      O("Use pg_dump and restore into Aurora.", false, "Hours of downtime for 5 TB."),
      O("Use AWS SCT to convert the schema, then DMS with full load and CDC.", false, "SCT is for converting between different engines. It adds an unnecessary step here."),
      O("Use AWS DMS with full load only.", false, "A one-time copy. Changes made during and after the copy are missed, which means longer downtime."),
      O("Use AWS DMS with full load plus change data capture, and cut over when the target has caught up.", true, "Keeps source and target in sync until cutover, so downtime is minimal.")
    ],
    r: "Same engine, minimal downtime: DMS full load plus CDC. SCT only when engines differ."
  },

  // ---------- Syntax and snippets (oc: true shows the options in monospace) ----------
  {
    id: "syn-dqdl", d: 1, t: "Syntax", oc: true,
    q: "A data engineer is writing an AWS Glue Data Quality ruleset (DQDL) for a customers table. The customer_id column must have no missing values. The email column must match a pattern for valid addresses. The status column may contain only ACTIVE, INACTIVE or PENDING. Which ruleset is correct?",
    o: [
      O(`Rules = [
  IsComplete "customer_id",
  ColumnValues "email" matches "[^@]+@[^@]+[.][a-z]+",
  ColumnValues "status" in ["ACTIVE","INACTIVE","PENDING"]
]`, true, "Valid DQDL: IsComplete for no missing values, matches for the pattern, and in with a bracketed list."),
      O(`Rules = [
  NotNull "customer_id",
  Pattern "email" "[^@]+@[^@]+[.][a-z]+",
  AllowedValues "status" ["ACTIVE","INACTIVE","PENDING"]
]`, false, "NotNull, Pattern and AllowedValues are not DQDL rule types."),
      O(`Rules = [
  Completeness "customer_id" > 0.5,
  ColumnValues "email" matches "[^@]+@[^@]+[.][a-z]+",
  ColumnValues "status" in ["ACTIVE","INACTIVE","PENDING"]
]`, false, "Completeness above 0.5 still allows half the values to be missing. No missing values needs IsComplete or Completeness = 1.0."),
      O(`Rules = [
  IsComplete "customer_id",
  ColumnValues "email" matches "[^@]+@[^@]+[.][a-z]+",
  ColumnValues "status" in ("ACTIVE","INACTIVE","PENDING")
]`, false, "The allowed-values list must use square brackets, not parentheses.")
    ],
    r: "DQDL: Rules = [ ... ]. IsComplete for no nulls, ColumnValues with matches or in [ ... ] for patterns and lists."
  },
  {
    id: "syn-iam", d: 4, t: "Syntax",
    q: "A Glue job reads known objects under the daily/ prefix of the bucket analytics-raw and writes results under the out/ prefix of the bucket analytics-curated. The company follows least-privilege practice. Which permissions should the job's role have?",
    o: [
      O("Allow s3:* on arn:aws:s3:::analytics-raw and arn:aws:s3:::analytics-curated and their objects.", false, "Far more than needed. Full S3 access on both buckets breaks least privilege."),
      O("Allow s3:GetObject and s3:PutObject on arn:aws:s3:::analytics-raw/daily/* and arn:aws:s3:::analytics-curated/out/*.", false, "Allows writing to the raw prefix and reading from the curated prefix, which the job does not need."),
      O("Allow s3:GetObject on arn:aws:s3:::analytics-raw/daily/* and s3:ListBucket on arn:aws:s3:::analytics-raw. Allow s3:PutObject on arn:aws:s3:::analytics-curated/out/*.", true, "Each action is limited to the one prefix that needs it. Object actions use the /* object ARN, and listing uses the bucket ARN."),
      O("Allow s3:GetObject on arn:aws:s3:::analytics-raw and s3:PutObject on arn:aws:s3:::analytics-curated.", false, "Bucket ARNs do not match objects. Object actions need an ARN ending in /*.")
    ],
    r: "Least privilege: only the actions needed, on the narrowest resource. Object actions use bucket/prefix/*."
  },
  {
    id: "syn-retry", d: 1, t: "Syntax", oc: true,
    q: "A Step Functions task calling a Lambda function should be retried up to 3 times when any error occurs. The first wait is 5 seconds and each following wait doubles. Which definition does this?",
    o: [
      O(`"Retry": [{
  "ErrorEquals": ["States.ALL"],
  "IntervalSeconds": 5,
  "BackoffRate": 1.0,
  "MaxAttempts": 3
}]`, false, "BackoffRate 1.0 keeps the wait constant at 5 seconds."),
      O(`"Retry": [{
  "ErrorEquals": ["States.ALL"],
  "IntervalSeconds": 5,
  "BackoffRate": 2.0,
  "MaxAttempts": 3
}]`, true, "IntervalSeconds is the first wait, BackoffRate 2.0 doubles it, MaxAttempts is the number of retries."),
      O(`"Catch": [{
  "ErrorEquals": ["States.ALL"],
  "Next": "RetryState"
}]`, false, "Catch routes to another state after failure. It does not retry the same task with backoff."),
      O(`"Retry": [{
  "ErrorEquals": ["States.ALL"],
  "IntervalSeconds": 5,
  "BackoffRate": 2.0,
  "MaxAttempts": 1
}]`, false, "MaxAttempts 1 retries only once.")
    ],
    r: "Retry fields: ErrorEquals, IntervalSeconds, BackoffRate (multiplier), MaxAttempts. Catch is for routing after failure."
  },
  {
    id: "syn-ctas", d: 3, t: "Syntax", oc: true,
    q: "A data engineer wants one Athena statement that creates a new table from a query, stored as Parquet and partitioned by sale_date. Which statement does this?",
    o: [
      O(`CREATE EXTERNAL TABLE sales_parquet
PARTITIONED BY (sale_date)
STORED AS PARQUET
AS SELECT item, amount, sale_date FROM sales_csv;`, false, "CREATE EXTERNAL TABLE ... AS SELECT is not valid Athena syntax. CTAS is CREATE TABLE ... AS."),
      O(`CREATE TABLE sales_parquet
WITH (format = 'PARQUET',
      partitioned_by = ARRAY['sale_date'],
      external_location = 's3://my-bucket/sales_parquet/')
AS SELECT item, amount, sale_date FROM sales_csv;`, true, "This is CTAS. The partition column comes last in the SELECT."),
      O(`INSERT OVERWRITE DIRECTORY 's3://my-bucket/sales_parquet/'
STORED AS PARQUET
SELECT item, amount, sale_date FROM sales_csv;`, false, "That is Hive syntax and does not create an Athena table."),
      O(`UNLOAD (SELECT item, amount, sale_date FROM sales_csv)
TO 's3://my-bucket/sales_parquet/'
WITH (format = 'PARQUET', partitioned_by = ARRAY['sale_date']);`, false, "UNLOAD writes files but does not create a table.")
    ],
    r: "Athena CTAS: CREATE TABLE ... WITH (format, partitioned_by, external_location) AS SELECT, partition column last."
  },
  {
    id: "syn-copy", d: 2, t: "Syntax", oc: true,
    q: "A data engineer must load gzip-compressed CSV files from S3 into a Redshift table. Following security best practice, the load should use an IAM role. Which command is correct?",
    o: [
      O(`COPY sales
FROM 's3://my-bucket/sales/'
CREDENTIALS 'aws_access_key_id=AKIA...;aws_secret_access_key=...'
FORMAT AS CSV GZIP;`, false, "Works, but it puts long-lived access keys in the command. A role is the best practice."),
      O(`INSERT INTO sales
SELECT * FROM 's3://my-bucket/sales/';`, false, "Not valid. INSERT cannot read from an S3 path."),
      O(`COPY sales
FROM 's3://my-bucket/sales/'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftLoad'
FORMAT AS CSV GZIP;`, true, "COPY with IAM_ROLE is the standard, secure bulk load."),
      O(`UNLOAD ('SELECT * FROM sales')
TO 's3://my-bucket/sales/'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftLoad';`, false, "UNLOAD exports from Redshift to S3. It is the opposite direction.")
    ],
    r: "Load into Redshift: COPY ... IAM_ROLE. Export out: UNLOAD."
  },

  // ---------- Calculations ----------
  {
    id: "calc-shards", d: 1, t: "Calculations",
    q: "A provisioned-mode Kinesis data stream will receive 2,500 records per second, and each record is about 3 KB. Consumers use enhanced fan-out. What is the minimum number of shards needed to absorb the writes?",
    o: [
      O("3", false, "That uses only the records limit (2,500 / 1,000, rounded up). The bytes limit is larger here."),
      O("5", false, "Does not match either write limit."),
      O("8", true, "About 7,500 KB per second is roughly 7.3 MB per second, so 8 shards for bytes. Records need only 3. Take the larger."),
      O("15", false, "Far above either limit.")
    ],
    r: "Shards = the larger of (MB per second in, at 1 MB per shard) and (records per second, at 1,000 per shard), rounded up."
  },
  {
    id: "calc-rcu", d: 2, t: "Calculations",
    q: "A provisioned DynamoDB table holds items averaging 6 KB. The application makes 200 eventually consistent reads per second against single items. How many read capacity units are needed?",
    o: [
      O("100", false, "Too low. Each 6 KB read still needs one RCU when eventually consistent, so 200 reads need 200."),
      O("400", false, "That is the strongly consistent amount (2 RCUs per 6 KB read)."),
      O("200", true, "6 KB rounds up to 8 KB, which is 2 RCUs for a strongly consistent read and 1 RCU for an eventually consistent read. 200 reads need 200 RCUs."),
      O("600", false, "Does not match the calculation.")
    ],
    r: "RCU: round the item size up to 4 KB blocks, then halve it for eventually consistent reads, then multiply by reads per second."
  },

  // ---------- More services ----------
  {
    id: "cloudtrail-lake", d: 4, t: "Monitoring",
    q: "A security team needs to run SQL queries over three years of API activity from many AWS accounts, in one place, with as little setup as possible. Which solution should the data engineer choose?",
    o: [
      O("Send CloudTrail logs to S3 and build Athena tables over them in each account.", false, "Works, but you create and maintain the tables, partitions and cross-account access yourself."),
      O("Use an AWS CloudTrail Lake event data store with SQL queries.", true, "CloudTrail Lake stores events centrally and lets you query them with SQL. No tables to build."),
      O("Stream CloudTrail into CloudWatch Logs and use Logs Insights across accounts.", false, "Possible, but long retention and multi-account querying take more setup and cost."),
      O("Use AWS Config advanced queries.", false, "Config queries resource configuration, not API activity.")
    ],
    r: "Central SQL queries over CloudTrail events: CloudTrail Lake. (AWS closed Lake to new customers from 31 May 2026; Athena over trail logs in S3 is the alternative.)"
  },
  {
    id: "lambda-efs", d: 1, t: "Lambda",
    q: "A Lambda function needs read access to a 4 GB reference dataset. Many concurrent invocations must read the same files, and the function should not download the data on every invocation. Which solution meets these requirements?",
    o: [
      O("Package the dataset in a Lambda layer.", false, "Layers have a size limit far below 4 GB."),
      O("Copy the dataset into /tmp at the start of each invocation.", false, "Each invocation has its own /tmp, so every environment downloads the data again."),
      O("Download the dataset from S3 on each invocation.", false, "Works, but it is slow and repeated on every invocation."),
      O("Store the dataset in Amazon EFS and mount the file system in the function.", true, "EFS is shared across concurrent invocations and mounts into Lambda.")
    ],
    r: "Large shared files for Lambda: mount Amazon EFS."
  },
  {
    id: "s3-object-lock", d: 4, t: "S3",
    q: "A financial company must keep trade records in S3 for seven years. Nobody, including account administrators, may delete or change them during that time. Which configuration meets this requirement?",
    o: [
      O("Enable versioning and deny DeleteObject in the bucket policy.", false, "An administrator can change the bucket policy or delete versions."),
      O("Use S3 Object Lock in governance mode with a seven-year retention.", false, "Users with the bypass permission can override governance mode."),
      O("Use S3 Object Lock in compliance mode with a seven-year retention.", true, "In compliance mode no one, including the root user, can delete or overwrite protected versions during retention."),
      O("Move the objects to S3 Glacier Deep Archive with a lifecycle rule.", false, "Lifecycle rules move objects between storage classes. They do not prevent deletion.")
    ],
    r: "WORM that even admins cannot bypass: S3 Object Lock in compliance mode."
  },
  {
    id: "glue-dpu-sizing", d: 3, t: "Glue",
    q: "A Glue Spark job runs for hours at its current setting of 10 DPUs. A data engineer must work out how much capacity the job really needs. Where should they look?",
    o: [
      O("The CloudWatch Logs for the job, searching for the text DPU.", false, "Job logs do not record DPU consumption."),
      O("The visual ETL section of the Glue console.", false, "That is for building and editing jobs, not for capacity analysis."),
      O("The aggregate Glue metrics in the CloudWatch console.", false, "The raw metrics exist there, but the console's job run monitoring view is the one that profiles a run for capacity planning."),
      O("The job run monitoring section of the Glue console, using the profiled metrics from previous runs.", true, "This view profiles previous runs and shows how many workers the job actually needs.")
    ],
    r: "Right-sizing Glue capacity: job run monitoring and profiled metrics."
  },

  // ======================= DOMAIN 1 (part A) =======================
  {
    id: "glue-crawler-incremental", d: 1, t: "Glue",
    q: "A company's raw zone holds four years of daily partitions (year/month/day) of partner order files. A nightly Glue crawler on the raw prefix has grown from minutes to over two hours, although only the newest day's folder changes and the file layout has not changed in years. Athena, Redshift Spectrum and Glue jobs all read the resulting table. The team wants the crawl time back to minutes with the LEAST operational overhead. Which solution meets these requirements?",
    o: [
      O("Change the crawler to crawl new sub-folders only.", true, "An incremental crawl lists only new folders and adds their partitions. Fine here because the schema is stable."),
      O("Configure the crawler to sample a subset of files in each folder.", false, "Fewer files are read per folder, but the crawler still walks every old partition folder."),
      O("Remove the crawler and define partition projection on the table.", false, "Projection is an Athena feature. Spectrum and Glue jobs would not see the partitions."),
      O("Replace the crawler with an S3 event that invokes a Lambda function calling BatchCreatePartition.", false, "Works, but you write and maintain code that a crawler setting already provides."),
    ],
    r: "Stable schema, only new partition folders: crawler set to crawl new sub-folders only. It forces schema updates to log-only."
  },
  {
    id: "glue-pushdown-predicate", d: 1, t: "Glue",
    q: "A Glue Spark job is started with a run_date parameter to reprocess one day of an orders table in the Data Catalog. The table is partitioned by dt and holds five years of data. The job takes hours even though one day holds little data. The relevant code is shown. Which change improves performance with the LEAST effort?",
    code: `orders = glueContext.create_dynamic_frame.from_catalog(
    database="sales",
    table_name="orders",
    transformation_ctx="orders")
day = orders.filter(lambda r: r["dt"] == args["run_date"])`,
    o: [
      O("Add a partition index to the table and keep the filter.", false, "Speeds up partition lookups only when a predicate is used. Without one every partition is still read."),
      O("Pass a push_down_predicate on dt to from_catalog.", true, "Prunes partitions before any files are read, instead of loading everything and filtering afterwards."),
      O("Enable job bookmarks and keep the filter after the read.", false, "Bookmarks track what earlier runs processed. A planned reprocessing of a chosen day is the opposite, and old partitions are still scanned."),
      O("Use G.2X workers instead of G.1X with the same code.", false, "More memory per worker, but the job still lists and reads five years of data."),
    ],
    r: "Read only some partitions: push_down_predicate (partition columns only). Filtering after the read is too late."
  },
  {
    id: "glue-flex-cost", d: 1, t: "Glue",
    q: "A finance team runs a nightly Glue Spark job at 1 AM that takes about 40 minutes. Reports are only needed by 8 AM, and nobody minds if the job starts late or runs longer. The Glue bill is one of the largest line items, and the load is the same size every night. Which change is the MOST cost-effective?",
    o: [
      O("Convert the job to a Glue Python shell job.", false, "Python shell is a single node without Spark. A Spark workload would need a rewrite."),
      O("Turn on Glue auto scaling and lower the maximum number of workers.", false, "Auto scaling helps variable loads. A same-size nightly load gains little, and the price per DPU-hour is unchanged."),
      O("Run the job with the Flex execution class.", true, "Flex uses spare capacity at a lower DPU-hour price. Right for non-urgent jobs with plenty of slack."),
      O("Move the job to a transient EMR cluster with Spot task nodes.", false, "Can be cheaper, but you now own cluster configuration and Spot interruptions."),
    ],
    r: "Non-urgent Glue Spark job, cost matters: Flex execution class. Auto scaling is for variable load."
  },
  {
    id: "glue-resolvechoice", d: 1, t: "Glue", oc: true,
    q: "A Glue job reads partner JSON in which the price field is a number in most records but a quoted string in some. The DynamicFrame shows price as a choice type, and the job fails when writing Parquet to a table where price must be a double. Which transformation fixes this with the LEAST effort?",
    o: [
      O(`datasource.relationalize("root", "s3://bucket/tmp/")`, false, "Relationalize flattens nested structures into tables. It does not settle a type conflict."),
      O(`datasource.resolveChoice(choice="make_struct")`, false, "Keeps both versions as a struct with an int part and a string part, not one double column."),
      O(`datasource.drop_fields(["price"])`, false, "Removes the column and loses the data."),
      O(`datasource.resolveChoice(specs=[("price", "cast:double")])`, true, "The cast spec turns the choice into a single double column."),
    ],
    r: "Mixed types in one column become a choice type. Settle it with resolveChoice, for example cast:double."
  },
  {
    id: "glue-streaming-iceberg", d: 1, t: "Glue",
    q: "A retailer streams point-of-sale events into Kinesis Data Streams. Each event must be enriched with a customer dimension kept as Parquet in S3 and written to an Apache Iceberg table within about a minute. The engineers know Spark well and do not want to run clusters. Which solution has the LEAST operational overhead?",
    o: [
      O("A Glue streaming ETL job that joins the dimension and writes Iceberg.", true, "Serverless Spark micro-batches. The team's Spark skills carry over and there is no cluster."),
      O("Firehose with a Lambda transform that looks up each customer in S3.", false, "Firehose has no join with an S3 dimension. Per-record S3 lookups in Lambda are slow and custom."),
      O("A Managed Service for Apache Flink application joining the stream and the dimension.", false, "Capable, but the team would build and run a Flink application in a skill they lack."),
      O("Spark Structured Streaming on a long-running EMR cluster.", false, "Works, but you manage cluster sizing and uptime."),
    ],
    r: "Spark team, streaming, no clusters: Glue streaming ETL job. Flink when you need low-latency windows and state."
  },
  {
    id: "glue-schema-registry", d: 1, t: "Glue",
    q: "Several teams publish Avro events to an MSK topic that a central analytics team reads. Twice this quarter a producer changed a field type and downstream consumers began failing. The analytics team wants incompatible schema changes rejected before bad messages reach the topic, without building a validation service. Which solution has the LEAST operational overhead?",
    o: [
      O("A Lambda consumer that validates each message and drops invalid ones into SQS.", false, "Custom code, and it checks after publishing rather than blocking incompatible schema changes."),
      O("The Glue Schema Registry with a compatibility mode and its serializers in the producers.", true, "The registry refuses incompatible new schema versions, and the serializers enforce registered schemas."),
      O("A Glue crawler on the landed data that alerts through SNS when the schema changes.", false, "Detects the change after the bad data has already arrived."),
      O("The topic converted to JSON, with fields filtered by Lake Formation.", false, "Lake Formation controls data access, not message schemas."),
    ],
    r: "Block incompatible schema evolution for Kafka or Kinesis producers: Glue Schema Registry with a compatibility mode."
  },
  {
    id: "glue-trigger-all", d: 1, t: "Glue",
    q: "A Glue workflow runs two independent ETL jobs, JobA and JobB, in parallel. A crawler must run once, after both jobs have succeeded, and not at all if either fails. The team wants to do this inside Glue without extra services. Which configuration is correct?",
    o: [
      O("One conditional trigger on both jobs succeeding, logical operator ANY, starting the crawler.", false, "ANY fires as soon as one job succeeds, before the other has finished."),
      O("A scheduled trigger that starts the crawler a while after the jobs usually end.", false, "A timing guess. It runs even when a job failed or is still running."),
      O("One conditional trigger on both jobs succeeding, logical operator ALL, starting the crawler.", true, "ALL waits for both watched jobs to reach SUCCEEDED, and it never fires if one fails."),
      O("Two conditional triggers, one per job, each starting the crawler.", false, "The crawler would start once after each job: early, and twice."),
    ],
    r: "Run something after several Glue jobs all succeed: one conditional trigger with ALL. ANY fires on the first."
  },
  {
    id: "s3-events-two-targets", d: 1, t: "Orchestration",
    q: "Partners drop files into a landing bucket. Each new file must start an existing Glue workflow and also start a Step Functions state machine that updates a catalog of deliveries. The team wants this wiring with the LEAST operational overhead and no polling. Which solution meets these requirements?",
    o: [
      O("Two S3 event notifications on the same prefix, one to Lambda and one to SQS.", false, "S3 does not accept overlapping notification configurations for the same event type, and the targets would still need glue code."),
      O("S3 events to an SNS topic, with subscriptions for the workflow and the state machine.", false, "SNS cannot start a Glue workflow or a state machine directly. You would add Lambda functions between them."),
      O("A Lambda function every minute that lists the bucket and starts both.", false, "Polling, plus code to maintain."),
      O("S3 events sent to EventBridge, with one rule per target.", true, "One event source, several rules, and both are native EventBridge targets."),
    ],
    r: "Same S3 event, several targets, no code: S3 to EventBridge with one rule per target."
  },
  {
    id: "sqs-lambda-max-concurrency", d: 1, t: "Lambda",
    q: "A Lambda function reads from a standard SQS queue and calls a partner API that allows only ten concurrent connections. During backlogs the function scales out and the partner starts returning errors. The team set the function's reserved concurrency to 10, but now many healthy messages end up in the dead-letter queue. The team wants to cap parallelism without losing messages. What should they do?",
    o: [
      O("Remove the reserved concurrency and set maximum concurrency to 10 on the event source mapping.", true, "The poller stops pulling more than 10 concurrent batches, so extra messages wait in the queue instead of being throttled."),
      O("An SQS delay queue so messages arrive more slowly, with the DLQ unchanged.", false, "Delays each message but does not cap concurrent invocations during a backlog."),
      O("Reserved concurrency of 10 plus a higher maxReceiveCount on the dead-letter queue.", false, "Hides the symptom. Throttled invocations still burn receive attempts."),
      O("A FIFO queue with a single message group feeding the function.", false, "Serializes everything to one at a time, far below the ten allowed connections."),
    ],
    r: "Cap Lambda parallelism from SQS without throttling: maximum concurrency on the event source mapping, not reserved concurrency."
  },
  {
    id: "lambda-partial-batch", d: 1, t: "Lambda",
    q: "A Lambda function processes SQS messages in batches of ten and writes each one to a downstream database. When one message fails, the whole batch becomes visible again and the nine good messages are processed a second time, creating duplicates. The team wants to retry only the failing message, with the least code and cost. What should they do?",
    o: [
      O("A longer queue visibility timeout so failed messages come back later.", false, "Delays redelivery. Successful messages are still retried with the failed one."),
      O("ReportBatchItemFailures on the event source mapping, returning the failed IDs.", true, "Only the listed messages return to the queue. The rest are deleted."),
      O("Idempotent database writes using conditional writes in DynamoDB.", false, "Duplicates become harmless, but good messages are still reprocessed and you add code."),
      O("A batch size of 1 on the event source mapping, with more concurrency.", false, "Stops the duplicates but multiplies invocations and cost."),
    ],
    r: "One bad message must not replay the batch: partial batch response (ReportBatchItemFailures)."
  },
  {
    id: "kinesis-hot-partition", d: 1, t: "Kinesis",
    q: "IoT devices send readings to a provisioned Kinesis stream with 8 shards. Producers log ProvisionedThroughputExceeded errors, yet total incoming bytes are only about a third of the stream's capacity. The partition key is the site ID, and one large site produces most of the traffic. The team wants the errors gone with the LEAST change. Which solution meets these requirements?",
    o: [
      O("Double the shard count with uniform scaling and keep the site ID key.", false, "More shards, but the hot key still hashes to one of them."),
      O("Firehose placed in front of the stream to absorb the burst.", false, "Firehose is a delivery service and does not change how keys map to shards."),
      O("A random suffix on the partition key, aggregated by site downstream.", true, "Spreads the big site's records over many shards."),
      O("On-demand capacity mode for the stream, keeping the site ID key.", false, "On-demand scales the stream, but one hot partition key still maps to a single shard."),
    ],
    r: "Hot KEY: change the key. Spiky VOLUME: on-demand mode."
  },
  {
    id: "kinesis-efo-consumers", d: 1, t: "Kinesis",
    q: "Three applications read the same 6-shard Kinesis stream: a Lambda function, a KCL application and a Flink application. Since the third consumer was added, all three show rising IteratorAge and the stream reports ReadProvisionedThroughputExceeded. Producers are fine. The company wants each consumer to read at full speed without adding shards. Which solution meets these requirements?",
    o: [
      O("Increase the retention period of the stream.", false, "Retention controls how long data is kept, not read throughput."),
      O("Switch the stream to on-demand capacity mode.", false, "Scales write capacity and shard count. Consumers still share each shard's read throughput."),
      O("Put an SQS queue between the stream and each consumer.", false, "Adds a forwarder to build and run, and still reads the shared throughput."),
      O("Register each consumer for enhanced fan-out.", true, "Every registered consumer gets its own 2 MB per second per shard instead of sharing 2 MB per second."),
    ],
    r: "Several consumers fighting over read throughput: enhanced fan-out (dedicated 2 MB/s per shard per consumer)."
  },
  {
    id: "firehose-lambda-failures", d: 1, t: "Kinesis",
    q: "A Firehose stream uses a Lambda function to normalize JSON logs before delivery to S3. A few percent of records are malformed and make the function fail for them. The team wants the other records delivered on time and the malformed ones kept somewhere they can inspect later, with the least extra work. What should the data engineer do?",
    o: [
      O("Return ProcessingFailed for them and set an error output prefix on the stream.", true, "Firehose writes failed records under the error prefix in S3 and keeps delivering the rest."),
      O("Source record backup enabled for all records on the delivery stream.", false, "Keeps every raw record, good ones too, so cost grows and failures are hard to separate."),
      O("Return Dropped for the malformed records from the function.", false, "Dropped records are discarded, not kept."),
      O("A dead-letter queue attached to the transform function.", false, "Firehose invokes the function synchronously, so a Lambda DLQ does not catch these."),
    ],
    r: "Firehose + Lambda transform: bad records return ProcessingFailed and land under the S3 error output prefix."
  },
  {
    id: "firehose-msk-source", d: 1, t: "Kinesis",
    q: "An engineering team runs a provisioned MSK cluster whose topics feed several microservices. The analytics team wants the JSON events from two topics in S3 as Parquet, partitioned by date, within a few minutes. Nobody wants to manage connector workers or write consumers. Which solution has the LEAST operational overhead?",
    o: [
      O("Spark Structured Streaming on EMR reading the topics and writing Parquet.", false, "Works, but you manage a cluster."),
      O("A Firehose stream with MSK as the source and Parquet in S3 as the destination.", true, "Firehose can read from MSK topics and convert and partition on delivery, serverless."),
      O("An MSK Connect S3 sink connector for each topic, converting to Parquet.", false, "Works, but you size and monitor connector workers and convert formats yourself."),
      O("A Lambda function on the topics that writes Parquet files to S3.", false, "Custom code, and tiny files unless you batch carefully."),
    ],
    r: "Kafka topic to S3 as Parquet with no code or workers: Firehose with MSK as the source."
  },
  {
    id: "dms-cdc-deletes", d: 1, t: "Migration",
    q: "A company wants an hourly up-to-date copy of its RDS for MySQL orders table in an S3 data lake for Athena. Rows are updated in place, and some are deleted. Analysts must never see deleted orders. The team is small and prefers managed services. Which solution meets these requirements?",
    o: [
      O("A daily RDS snapshot export to S3, queried with Athena.", false, "Daily, not hourly, and a full copy each time."),
      O("DMS full load to S3 every hour, replacing the table files.", false, "Reflects deletes but reloads everything each hour, which is heavy on the source and slow."),
      O("DMS full load plus CDC to S3 as Parquet, merged into Iceberg by a Glue job.", true, "CDC output carries an operation type (insert, update, delete), so the merge can apply deletes."),
      O("An hourly Glue JDBC job selecting rows with a newer updated_at and writing to S3.", false, "Catches inserts and updates, but deleted rows never show up in the query."),
    ],
    r: "Updates and deletes into the lake: DMS CDC to S3 (operation column) plus a MERGE into Iceberg."
  },
  {
    id: "transfer-family-static-ip", d: 1, t: "Ingestion",
    q: "Twelve partners deliver daily files over SFTP using their existing SSH keys. Partners allow-list the company's IP address in their firewalls, so it must not change. The company wants files in S3, no servers to patch, and each upload to kick off processing. Which solution has the LEAST operational overhead?",
    o: [
      O("SFTP on an EC2 instance with an Elastic IP, syncing to S3 with a cron job.", false, "Stable IP, but you patch and run the server."),
      O("Transfer Family SFTP on a public endpoint, with S3 storage and an EventBridge rule.", false, "A public endpoint's addresses are not under your control, so partners cannot reliably allow-list them."),
      O("AWS DataSync agents pulling from each partner's SFTP site into S3 on a schedule.", false, "DataSync does not provide an inbound SFTP endpoint for partners to push to."),
      O("Transfer Family SFTP on a VPC endpoint with Elastic IPs, S3 storage and an EventBridge rule.", true, "Elastic IPs give stable addresses. Transfer Family manages the SFTP server."),
    ],
    r: "Managed inbound SFTP to S3 with allow-listable IPs: Transfer Family on a VPC endpoint with Elastic IPs."
  },
  {
    id: "snow-compute-edge", d: 1, t: "Migration",
    q: "A mining company collects 20 TB of sensor data at a remote site that has only a slow satellite link. Before the data is sent to AWS, it must be filtered locally to drop calibration noise, and the filtered data must end up in S3. Which solution meets these requirements?",
    o: [
      O("A Snowball Edge Compute Optimized device that filters locally, then ships to S3.", true, "Holds the 20 TB, runs local compute for filtering, and is shipped for import."),
      O("An AWS Snowcone shipped back when full, then imported into S3.", false, "Snowcone holds at most 14 TB, less than the 20 TB collected."),
      O("Kinesis Data Streams fed over the satellite link, with filtering in Lambda.", false, "Streaming that volume over satellite is not realistic, and nothing filters locally."),
      O("A DataSync agent on site syncing to S3 over the satellite link.", false, "20 TB over a slow satellite link takes far too long, and there is no local filtering."),
    ],
    r: "Huge data, bad network, local processing first: Snowball Edge Compute Optimized."
  },
  {
    id: "sfn-distributed-map", d: 1, t: "Orchestration",
    q: "A nightly job must send about 2 million small JSON files from an S3 prefix, one by one, to an external scoring API, then store each response. Each file is independent, a small fraction may fail and that is acceptable, and the API tolerates about 500 parallel calls. The company wants as little custom orchestration code as possible. Which solution meets these requirements?",
    o: [
      O("A Lambda function listing the prefix and queueing each key in SQS for a second function.", false, "Works, but you build the listing, throttling and failure tracking."),
      O("A Step Functions Distributed Map over the S3 prefix, calling a Lambda function per item.", true, "Runs big parallel iterations over S3 objects with a concurrency limit and a tolerated failure threshold, with no listing or queueing code."),
      O("A Glue Spark job with groupFiles that reads all the files.", false, "Good for transformations, awkward for per-item external API calls with rate limits."),
      O("A Step Functions inline Map over a Lambda function that lists the prefix.", false, "Inline Map has a low concurrency ceiling and history limits, so it does not suit millions of items."),
    ],
    r: "Millions of S3 objects, parallel per-item work, tolerated failures: Step Functions Distributed Map."
  },
  {
    id: "syn-sfn-sync", d: 1, t: "Syntax", oc: true,
    q: "A Step Functions state machine must start an AWS Glue job and move to the next state only after the job run has finished. The next state must see the job's final status. Which task resource ARN configuration does this?",
    o: [
      O(`"Resource": "arn:aws:states:::glue:startJobRun.waitForTaskToken"`, false, "Waits for an external caller to return a task token. The Glue job does not do that by itself."),
      O(`"Resource": "arn:aws:states:::glue:startJobRun"`, false, "Request-response. The state completes as soon as the run starts, without waiting."),
      O(`"Resource": "arn:aws:states:::glue:startJobRun.sync"`, true, "The .sync (run a job) pattern waits until the job run completes and returns its result."),
      O(`"Resource": "arn:aws:states:::lambda:invoke"`, false, "Invokes a function. It neither starts the job nor waits for it."),
    ],
    r: ".sync waits for an AWS-managed job. .waitForTaskToken waits for an outside caller. Plain ARN does not wait."
  },
  {
    id: "emr-fleet-spot", d: 1, t: "EMR",
    q: "A nightly Spark and Hive pipeline needs bootstrap actions and cluster-level configuration for several Hadoop tools, so the team runs it on EMR. It runs for about three hours. Cost is the priority, but the job must finish even when Spot capacity gets tight. Which cluster design is the MOST cost-effective while still resilient?",
    o: [
      O("A transient cluster with every node on Spot, using one instance type.", false, "Cheapest on paper, but losing core nodes can lose HDFS data and one type is easy to run out of."),
      O("EMR Serverless with pre-initialized capacity for the nightly run.", false, "No cluster to run, but there are no bootstrap actions or cluster-level configuration, which the job relies on."),
      O("A long-running On-Demand cluster with uniform instance groups and managed scaling.", false, "Safe but pays for On-Demand and idle time between runs."),
      O("A transient cluster with instance fleets: On-Demand primary and core, Spot task nodes.", true, "Core nodes holding HDFS stay safe, Spot task nodes save money, and several types improve Spot availability. The cluster ends after the job."),
    ],
    r: "EMR cost pattern: transient cluster, On-Demand primary and core, Spot task nodes, instance fleets for diversity."
  },
  {
    id: "batch-long-container", d: 1, t: "Compute",
    q: "A containerized Python job validates one large partner file at a time. A run needs 30 GB of memory and takes about two hours. Files arrive at irregular times, a few per day. The team wants no idle servers and little operations work. Which solution has the LEAST operational overhead?",
    o: [
      O("AWS Batch with a job queue, submitted by an EventBridge rule on object creation.", true, "Batch runs containers of this size and duration, scales to zero, and is submitted by events."),
      O("A Lambda container image invoked by S3 event notifications.", false, "Lambda stops at 15 minutes."),
      O("An always-on ECS service that polls the bucket for new files.", false, "Works, but it runs and bills all day for a few files."),
      O("A Glue Python shell job started by an EventBridge rule on object creation.", false, "Python shell nodes are small, and this is a custom container workload."),
    ],
    r: "Long-running or big-memory containers on demand: AWS Batch. Lambda tops out at 15 minutes."
  },
  {
    id: "sfn-rate-limited-api", d: 1, t: "Orchestration",
    q: "A daily job must pull about 400 pages of data from a third-party REST API that allows five concurrent requests and answers with HTTP 429 when the limit is exceeded. Pages should be stored in S3 as raw JSON. The team wants retries handled without custom retry code. Which solution is the best fit?",
    o: [
      O("A Glue Python shell job that loops over the pages and writes to S3.", false, "Works sequentially, but retry and backoff logic is yours to write."),
      O("Step Functions Map with MaxConcurrency 5, calling Lambda with Retry and backoff.", true, "Concurrency is capped in the state machine and retries with backoff are built in."),
      O("SNS fanning out one message per page to Lambda functions with default scaling.", false, "Lambda would scale far above five concurrent calls and trigger 429s."),
      O("An EC2 instance running a cron script that writes to S3.", false, "Works, but you run the server and write the retry code."),
    ],
    r: "Rate-limited external API: Step Functions Map with MaxConcurrency plus Retry with backoff."
  },
  {
    id: "glue-bookmark-ctx", d: 1, t: "Glue",
    q: "A Glue job reads an S3 prefix and appends to a curated table. Job bookmarks are enabled in the job settings, yet every run reprocesses all files and creates duplicates. The relevant code is shown. What is the fix?",
    code: `import sys
from awsglue.context import GlueContext
from awsglue.job import Job
glueContext = GlueContext(SparkContext.getOrCreate())
job = Job(glueContext)
src = glueContext.create_dynamic_frame.from_options(
    connection_type="s3",
    connection_options={"paths": ["s3://raw-bucket/orders/"]},
    format="json")
glueContext.write_dynamic_frame.from_options(
    frame=src, connection_type="s3",
    connection_options={"path": "s3://curated/orders/"},
    format="parquet")`,
    o: [
      O("Convert the DynamicFrame to a Spark DataFrame before the write, then write Parquet.", false, "DataFrames are not what stores bookmark state, so this would not help."),
      O("A push_down_predicate on the S3 path for the read, on the same job.", false, "Prunes partitions of a catalog table. It does not remember processed files."),
      O("A transformation_ctx on the read, plus job.init at the start and job.commit at the end.", true, "Bookmarks need the job to be initialized, a context name on each source, and a commit to save the state."),
      O("A Glue crawler run before every job run to refresh the catalog.", false, "A crawler updates metadata and does not track processed files."),
    ],
    r: "Bookmarks need job.init, a transformation_ctx on each source, and job.commit."
  },

  // ======================= DOMAIN 1 (part B) =======================
  {
    id: "glue-vpc-selfref-s3", d: 1, t: "Glue",
    q: "A Glue Spark job runs in a private subnet through a Glue connection, reads a private RDS for PostgreSQL database and writes Parquet to S3. The RDS security group already allows the connection's security group on the database port. The job fails to start with an error saying the security group must allow all ingress traffic from itself, and after that is sorted out, the job hangs when it writes to S3. The subnet has no NAT gateway, and the company wants the MOST cost-effective fix. Which TWO actions should the data engineer take?",
    o: [
      O("Add a NAT gateway to the subnet and route S3 traffic through it.", false, "Fixes S3 access, but adds an hourly charge plus per-GB processing fees."),
      O("Add a self-referencing inbound rule to the security group used by the Glue connection.", true, "The job's workers must talk to each other, which needs a rule allowing all traffic from the same group."),
      O("Assign public IP addresses to the Glue workers so they can reach S3.", false, "Workers run on network interfaces in your subnet and do not get public IPs this way."),
      O("Create an interface VPC endpoint for AWS Glue.", false, "The job already starts. The problems are worker-to-worker traffic and reaching S3."),
      O("Create an S3 gateway VPC endpoint and add it to the subnet's route table.", true, "No hourly charge, keeps traffic private, and lets the job reach S3 without NAT."),
    ],
    r: "Glue in a VPC: self-referencing security group rule plus an S3 gateway endpoint (cheaper than NAT)."
  },
  {
    id: "syn-window-latest", d: 1, t: "Syntax", oc: true,
    q: "A Redshift table cdc_orders receives several change rows per order_id, each with an updated_at timestamp. An analyst needs exactly one row per order, with every column of the most recent change. Which query does this?",
    o: [
      O(`SELECT order_id, MAX(updated_at)
FROM cdc_orders
GROUP BY order_id;`, false, "Returns only the key and the timestamp, not the other columns."),
      O(`SELECT *
FROM cdc_orders
GROUP BY order_id
HAVING updated_at = MAX(updated_at);`, false, "Invalid: SELECT * with GROUP BY and a non-aggregated column."),
      O(`SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY order_id ORDER BY updated_at ASC) AS rn
  FROM cdc_orders) t
WHERE rn = 1;`, false, "Ordering ascending keeps the oldest change, not the newest."),
      O(`SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY order_id ORDER BY updated_at DESC) AS rn
  FROM cdc_orders) t
WHERE rn = 1;`, true, "Numbers each order's rows newest first and keeps the first one."),
    ],
    r: "Latest row per key: ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC) and keep rn = 1."
  },
  {
    id: "sam-local-deploy", d: 1, t: "IaC",
    q: "A developer is building a small serverless pipeline: an S3 event triggers a Lambda function that writes to DynamoDB, and an API Gateway endpoint reads the data. She wants to describe everything as code in a short template, run the function locally against test events, and deploy with one command. Which tool is the best fit?",
    o: [
      O("AWS SAM with a template, sam local invoke and sam deploy.", true, "SAM's shorthand resource types keep serverless templates short, and its CLI adds local testing and one-command deployment through CloudFormation."),
      O("Plain CloudFormation YAML deployed from the console.", false, "Works, but verbose, and there is no local invocation."),
      O("Build the resources in the console, then export the template.", false, "Not a repeatable code-first workflow, and no local testing."),
      O("AWS CDK in Java with cdk deploy.", false, "Valid IaC, but more code for a small serverless app, and local testing needs extra tooling."),
    ],
    r: "Serverless app as short IaC with local testing: AWS SAM (sam local invoke, sam deploy)."
  },
  {
    id: "cicd-glue-pipeline", d: 1, t: "IaC",
    q: "A team keeps Glue job scripts and a CloudFormation template in a Git repository. Every merge to main should run PySpark unit tests, deploy to a dev account, wait for a manual approval, and then deploy to production. The team does not want servers to manage. Which solution has the LEAST operational overhead?",
    o: [
      O("Jenkins on EC2 running the tests, then deploying with the AWS CLI.", false, "Works, but you operate Jenkins."),
      O("CodePipeline with CodeBuild tests, CloudFormation deploys to dev and prod, and manual approval.", true, "Managed stages for test, deploy and approval."),
      O("CodePipeline with CodeBuild tests and CodeDeploy deploying the Glue jobs.", false, "CodeDeploy targets EC2, Lambda and ECS, not Glue jobs."),
      O("An EventBridge rule on Git pushes invoking Lambda to copy scripts to S3.", false, "No tests, no approval step and no infrastructure deployment."),
    ],
    r: "Managed CI/CD for data pipeline code: CodePipeline + CodeBuild (tests) + CloudFormation deploys + manual approval."
  },
  {
    id: "lambda-idempotent-write", d: 1, t: "Lambda",
    q: "A Lambda function consumes messages from an SQS standard queue and inserts one DynamoDB item per order. Occasionally the same message is delivered twice and the order is counted twice in revenue reports. The team wants duplicates to have no effect, with the least infrastructure change. What should they do?",
    o: [
      O("Reserved concurrency of 1 on the function.", false, "Does not stop redelivery and cuts throughput."),
      O("A FIFO queue replacing the queue, with content-based deduplication.", false, "Deduplication covers sends within five minutes. Redelivery after a processing timeout can still happen, and you need a new queue."),
      O("A conditional put on the order ID so a second write is rejected.", true, "An idempotent write makes at-least-once delivery harmless."),
      O("A batch size of 1 on the event source mapping.", false, "Duplicates come from at-least-once delivery, not from batch size."),
    ],
    r: "At-least-once delivery means duplicates happen. Make the write idempotent (conditional put or idempotency key)."
  },
  {
    id: "lambda-pandas-layer", d: 1, t: "Lambda",
    q: "A Lambda function converts CSV files to Parquet with pandas and pyarrow. Packaging the libraries in the deployment zip fails because the unzipped size is over the limit. The developer wants the quickest fix with the least maintenance. What should she do?",
    o: [
      O("Package the function as a container image.", false, "Works up to 10 GB, but you build, push and maintain an image."),
      O("Mount an EFS file system holding the libraries.", false, "Needs VPC configuration and a file system to manage."),
      O("Download the libraries from S3 into /tmp on each cold start.", false, "Slow cold starts and extra code to maintain."),
      O("Add the AWS-managed AWS SDK for pandas Lambda layer.", true, "A prebuilt layer with pandas and pyarrow that AWS maintains."),
    ],
    r: "pandas/pyarrow in Lambda without size trouble: the AWS SDK for pandas managed layer. Containers allow 10 GB."
  },
  {
    id: "glue-pythonshell-cost", d: 1, t: "Glue",
    q: "Each night a 300 MB CSV file from a partner must be lightly cleaned with pandas and loaded into DynamoDB. The run takes about 50 minutes, mostly because of the DynamoDB writes. The team wants no servers and the cheapest option that works. Which solution is the MOST cost-effective?",
    o: [
      O("A Glue Python shell job.", true, "Small fractional-DPU billing, pandas available, and no 15-minute limit."),
      O("A Glue Spark job with two G.1X workers.", false, "Works, but pays for a Spark cluster the job does not need."),
      O("An EMR Serverless Spark application.", false, "Works, but adds Spark overhead to a small single-machine job."),
      O("A Lambda function triggered by the S3 upload.", false, "The run exceeds the 15-minute Lambda limit."),
    ],
    r: "Small, long-running, non-Spark job: Glue Python shell. Lambda stops at 15 minutes."
  },
  {
    id: "redshift-streaming-ingestion", d: 1, t: "Redshift",
    q: "Clickstream events arrive in a Kinesis data stream. A fraud dashboard that queries Redshift must show them within seconds of arrival. The team wants as few moving parts as possible. Which solution has the LEAST operational overhead?",
    o: [
      O("A Managed Service for Apache Flink application writing to Redshift over JDBC.", false, "Works, but it is an application to build and run."),
      O("Streaming ingestion: an external schema on the stream and an auto-refresh materialized view.", true, "Redshift pulls from the stream directly into a materialized view, with seconds of latency and nothing in between."),
      O("Firehose delivering to S3 every minute, then a scheduled COPY into Redshift.", false, "Latency is minutes, and it has several pieces to schedule."),
      O("A Lambda function inserting each record through the Redshift Data API.", false, "Row-by-row inserts are slow, and it is code to maintain."),
    ],
    r: "Kinesis or MSK to Redshift in seconds: streaming ingestion into an auto-refresh materialized view."
  },
  {
    id: "aurora-zero-etl", d: 1, t: "Redshift",
    q: "An orders application runs on Aurora MySQL. The business wants near-real-time analytics in Redshift without affecting the production database. The team does not want to build or monitor a pipeline. Which solution has the LEAST operational overhead?",
    o: [
      O("A Glue job that queries the Aurora writer every hour.", false, "Hourly is not near real time, and it loads the production database."),
      O("DMS with full load plus CDC into Redshift.", false, "Works, but you run and monitor a replication instance and tasks."),
      O("An Aurora zero-ETL integration with Redshift.", true, "Aurora replicates changes into Redshift continuously. No pipeline to build."),
      O("Redshift federated queries against an Aurora read replica.", false, "Analytic scans hit the OLTP replica on every query, and they are slower than local tables."),
    ],
    r: "Aurora (or DynamoDB, RDS) to Redshift analytics with no pipeline: zero-ETL integration."
  },
  {
    id: "redshift-auto-copy", d: 1, t: "Redshift",
    q: "Partners write new CSV files to an S3 prefix throughout the day. The files must be loaded into a Redshift table soon after they arrive, and each file must be loaded exactly once. The team wants to avoid writing and scheduling code. Which solution has the LEAST operational overhead?",
    o: [
      O("A scheduled Glue job that reads new files and writes through JDBC.", false, "More pieces, and a slow row-based load."),
      O("An S3 event that invokes Lambda to run COPY through the Data API.", false, "Works, but you write the function and track which files were loaded."),
      O("A Spectrum external table over the prefix.", false, "Queries the files in place, which is slower, and nothing is loaded."),
      O("A COPY job (auto-copy) defined on the prefix.", true, "Redshift detects new files and loads each once."),
    ],
    r: "Continuous S3 to Redshift loading with no code: auto-copy (COPY JOB)."
  },
  {
    id: "redshift-copy-parallel", d: 1, t: "Redshift",
    q: "A nightly COPY loads one 200 GB gzip-compressed CSV file into a 16-node RA3 cluster. It takes hours while most of the cluster sits idle. The source system can export in any layout. What should the data engineer do to cut the load time the MOST?",
    o: [
      O("Many similarly sized compressed files under one prefix, loaded with a single COPY.", true, "COPY loads files in parallel across slices. One compressed file cannot be split."),
      O("COPY run with COMPUPDATE OFF and STATUPDATE OFF on the same single file.", false, "Skips compression analysis, a small saving next to the single-file bottleneck."),
      O("A resize to more nodes, loading the same single compressed file.", false, "A single gzip file is still read by one slice, so extra nodes do not help."),
      O("A sort key added to the target table before the same single-file load.", false, "Helps queries later. The load is limited by file layout."),
    ],
    r: "Fast COPY: many files of similar size (ideally a multiple of the slice count). One big gzip file loads on one slice."
  },
  {
    id: "s3-transfer-acceleration", d: 1, t: "S3",
    q: "Field offices on three continents upload 50 GB video files to one S3 bucket in eu-central-1. Uploads from far-away offices are slow and often fail partway. The company wants faster, more reliable uploads without installing or running infrastructure. Which solution is the best fit?",
    o: [
      O("Cross-Region replication of the bucket into each Region.", false, "Replication copies after the upload completes, so the slow upload remains."),
      O("S3 Transfer Acceleration on the bucket, with multipart uploads.", true, "Uploads enter at a nearby edge location and travel over the AWS network. Multipart upload lets failed parts be retried."),
      O("A CloudFront distribution in front of the bucket for uploads.", false, "CloudFront can pass uploads through, but it is built for delivery and adds no multipart handling."),
      O("A DataSync agent installed at each office.", false, "Works, but agents to install and manage at every site."),
    ],
    r: "Faster uploads over distance to one bucket: S3 Transfer Acceleration plus multipart upload."
  },
  {
    id: "sqs-fifo-ordering", d: 1, t: "Messaging",
    q: "An ordering service emits status updates for each order. Updates for the same order must be processed in the order they were sent, and the same update must never be processed twice. Volume is about 100 messages per second across many orders. The team wants a managed queue and the least custom code. Which solution is the best fit?",
    o: [
      O("An SQS standard queue, with a sequence number checked by the consumer.", false, "At-least-once and unordered. Ordering and de-duplication become your code."),
      O("An SNS standard topic fanning out to SQS standard queues.", false, "No ordering guarantee."),
      O("An SQS FIFO queue using the order ID as message group ID, read by Lambda.", true, "Ordering within each group and de-duplication are built in, while different orders run in parallel."),
      O("A Kinesis data stream with the order ID as partition key.", false, "Ordered per key, but delivery is at-least-once and you size shards."),
    ],
    r: "Per-key ordering plus no duplicates: SQS FIFO with MessageGroupId. Standard SQS is at-least-once and unordered."
  },
  {
    id: "sns-filter-policy", d: 1, t: "Messaging",
    q: "A billing service publishes invoice events to one SNS topic. A tax system needs only events of type refund, a notification service needs only overdue, and an archive needs everything. Each consumer reads from its own SQS queue. The company wants the LEAST operational overhead. What should the data engineer do?",
    o: [
      O("A Lambda router between the topic and the queues that forwards by event type.", false, "Custom code to run and monitor."),
      O("Three topics, with the publisher changed to send to the right one.", false, "Changes the publisher and duplicates its publishing logic."),
      O("All queues subscribed unfiltered, with consumers discarding what they do not need.", false, "Pays for and processes unwanted messages."),
      O("Each queue subscribed to the topic, with filter policies on event type for two of them.", true, "SNS delivers only matching messages to each subscription. No code."),
    ],
    r: "Selective fan-out from one SNS topic: subscription filter policies on SQS subscriptions."
  },
  {
    id: "calc-shards-records", d: 1, t: "Calculations",
    q: "A provisioned Kinesis data stream will receive 6,000 records per second, and each record is about 0.5 KB. Consumers use shared throughput. What is the minimum number of shards needed to absorb the writes?",
    o: [
      O("6", true, "6,000 records per second at 1,000 per shard needs 6 shards. Bytes need only 3. Take the larger."),
      O("9", false, "More than either limit requires."),
      O("12", false, "Twice what is needed."),
      O("3", false, "That satisfies the bytes limit only (about 3 MB per second). The records limit needs more."),
    ],
    r: "Shards = the larger of MB/s in (1 MB per shard) and records/s (1,000 per shard), rounded up."
  },
  {
    id: "ddb-to-kinesis-replay", d: 1, t: "Kinesis",
    q: "Analysts want every change to a DynamoDB orders table available in S3 as Parquet within minutes. The pipeline must be able to replay the previous seven days of changes after a fix. The team wants the least custom code. Which solution meets these requirements?",
    o: [
      O("Daily DynamoDB exports to S3, converted to Parquet by Glue.", false, "Full snapshots once a day, not changes within minutes."),
      O("Kinesis Data Streams as the table's stream destination with 7-day retention, plus Firehose for Parquet.", true, "Longer retention allows replay, and Firehose handles Parquet delivery with no code."),
      O("A Glue job scanning the table every five minutes and writing Parquet to S3.", false, "Consumes read capacity and misses deletes."),
      O("DynamoDB Streams read by a Lambda function writing Parquet to S3.", false, "DynamoDB Streams keeps records for 24 hours, so a seven-day replay is impossible, and it needs custom code."),
    ],
    r: "DynamoDB change stream with replay beyond 24 h: Kinesis Data Streams destination (retention up to 365 days)."
  },
  {
    id: "msk-serverless-fit", d: 1, t: "MSK",
    q: "A company moves several Kafka applications to AWS. The applications use standard Kafka client libraries and will not be rewritten. Traffic is unpredictable, the team is small, and nobody wants to size brokers. Which solution has the LEAST operational overhead?",
    o: [
      O("Self-managed Kafka on EC2 in an Auto Scaling group with EBS volumes.", false, "Most work: you patch, scale and recover the brokers."),
      O("Amazon MSK provisioned with storage auto scaling enabled.", false, "Storage grows automatically, but you still choose broker type and count."),
      O("Amazon MSK Serverless with the clients set up for IAM authentication.", true, "Capacity scales automatically and the Kafka APIs stay the same. Clients must use IAM auth."),
      O("Kinesis Data Streams in on-demand mode, read with the KCL.", false, "Requires rewriting producers and consumers to the Kinesis APIs."),
    ],
    r: "Kafka apps, unpredictable load, no sizing: MSK Serverless (IAM auth). Kinesis means a rewrite."
  },
  {
    id: "apigw-kinesis-integration", d: 1, t: "API Gateway",
    q: "A mobile app posts small JSON events over HTTPS. The company wants them put onto a Kinesis data stream with no code to run, and wants to throttle misbehaving clients by API key. Which solution has the LEAST operational overhead?",
    o: [
      O("An Application Load Balancer in front of EC2 producers writing to Kinesis.", false, "Servers to run, and per-key throttling would be custom."),
      O("API Gateway with a Lambda proxy that calls PutRecord on the stream.", false, "Works, but it is a function to write, deploy and pay for."),
      O("Devices given IAM credentials to call Kinesis directly.", false, "Distributes credentials to every device, with no per-key throttling."),
      O("API Gateway with a direct Kinesis service integration and a usage plan.", true, "API Gateway writes to Kinesis itself, and usage plans throttle per API key."),
    ],
    r: "HTTP in, Kinesis out, no code: API Gateway AWS service integration plus usage plans."
  },
  {
    id: "glue-findmatches", d: 1, t: "Glue",
    q: "Two product catalogs from companies that merged share no common ID. Names differ slightly, such as Acme Cordless Drill 18V and ACME 18 Volt Cordless Drill. The merged catalog needs duplicates identified, and the team can label a few thousand example pairs. They want the LEAST development effort. Which solution meets these requirements?",
    o: [
      O("The Glue FindMatches ML transform, trained on the labeled examples.", true, "Finds fuzzy duplicates without a common key and learns from labels."),
      O("A Glue job joining the two catalogs on exact product name after cleanup.", false, "Exact joins miss near-duplicates."),
      O("A DataBrew recipe with a remove-duplicates step across both catalogs.", false, "Its duplicate removal compares identical values."),
      O("Athena queries using LIKE patterns on product names across both catalogs.", false, "Manual, brittle, and will not scale to fuzzy matches."),
    ],
    r: "Duplicates or matches with no common key: Glue FindMatches (ML transform)."
  },
  {
    id: "redshift-super-partiql", d: 1, t: "Redshift",
    q: "Application events arrive as nested JSON with attributes that vary between events. Analysts want to query them in Redshift using SQL without a Glue job to flatten the structure first. Which approach meets this with the LEAST effort?",
    o: [
      O("Events converted to CSV before loading into Redshift.", false, "Nested structure is lost."),
      O("A SUPER column queried with PartiQL dot notation.", true, "SUPER holds semi-structured data natively with no flattening."),
      O("A Glue Relationalize job producing flat tables for Redshift.", false, "An extra job, and the schema needs changes whenever attributes change."),
      O("A VARCHAR column queried with JSON string functions.", false, "Works for simple cases, but it is slow and clumsy for nested data."),
    ],
    r: "Nested or varying JSON in Redshift: SUPER data type queried with PartiQL."
  },

  // ======================= DOMAIN 2 =======================
  {
    id: "crawler-hive-style-prefix", d: 2, t: "Glue",
    q: "A Firehose stream and a Glue job write partner data under s3://lake/orders/2024/06/01/. The crawled table shows partition columns named partition_0, partition_1 and partition_2, and analysts keep guessing which one is the month. The team wants meaningful partition column names to appear automatically every time the crawler runs, with the LEAST operational overhead. Which solution meets these requirements?",
    o: [
      O("Partition columns renamed in the Data Catalog after each crawl.", false, "Repeated manual work, and later crawls can overwrite the names."),
      O("Partition projection defined with named columns on the table.", false, "Athena-only, and other engines still see the generic names."),
      O("Hive-style prefixes such as year=2024/month=06/day=01, then a recrawl.", true, "Crawlers and Athena take partition column names from key=value folder names."),
      O("A custom grok classifier added to the crawler.", false, "Classifiers detect formats and schemas inside files, not folder names."),
    ],
    r: "Meaningful partition column names: Hive-style key=value prefixes. Otherwise crawlers name them partition_0, partition_1."
  },
  {
    id: "crawler-json-array-classifier", d: 2, t: "Glue",
    q: "A partner sends JSON files in which each file is one top-level array of order objects. The crawler creates a table with a single array column, and Athena returns one huge row per file. The team wants one row per order, with the LEAST effort. What should the data engineer do?",
    o: [
      O("A Lambda function converting the files to CSV on upload.", false, "Custom code, and it flattens a structure the classifier can read directly."),
      O("A Glue ETL job that relationalizes the array into a new table.", false, "Works, but it is a job to build and run for something a classifier handles."),
      O("A crawler setting that creates a separate table per file.", false, "Does not change how each file's array is read."),
      O("A custom JSON classifier with JsonPath $[*] attached to the crawler.", true, "The JsonPath tells the crawler that each array element is a record."),
    ],
    r: "Crawler misreads a JSON array as one record: custom JSON classifier with JsonPath $[*]. Custom classifiers run before built-in ones."
  },
  {
    id: "crawler-add-new-columns-only", d: 2, t: "Glue",
    q: "A crawler registers curated partner data in the Data Catalog. Engineers set the price column to decimal by hand, but each run flips it back to string because of a stray value in one file. Partners also add new fields now and then, and those columns and new partitions must keep appearing automatically. What should the data engineer do?",
    o: [
      O("Set the schema change policy to add new columns only.", true, "Existing column definitions stay as they are, while new columns and new partitions are still added."),
      O("Keep the default update behavior and set the delete behavior to mark the table deprecated.", false, "The default still rewrites price. Delete behavior concerns removed objects."),
      O("Switch the crawler to incremental crawls.", false, "Incremental crawls add new partitions only. New columns are not added, and changes are only logged."),
      O("Set the schema change policy to ignore changes.", false, "Keeps the types, but new columns that partners add are never registered."),
    ],
    r: "Crawler update behavior: update definition (default) overwrites; add new columns only keeps your edits; ignore/log adds no columns."
  },
  {
    id: "crawler-table-level", d: 2, t: "Glue",
    q: "A raw bucket holds s3://raw/sales/orders/, s3://raw/sales/returns/ and s3://raw/sales/customers/, each with CSV files that look alike. One crawler pointed at s3://raw/sales/ produced a single table with partition_0 set to orders, returns or customers, mixing three datasets. The team wants one table per dataset with the LEAST effort. What should the data engineer do?",
    o: [
      O("A custom classifier attached to the crawler for each dataset.", false, "Classifiers identify file formats, not where tables start."),
      O("Each dataset folder as its own include path, or the crawler's table level set to it.", true, "The crawler then treats each folder as a table root instead of a partition level."),
      O("The crawler option to create a single schema for each S3 path.", false, "That combines compatible schemas, which is the opposite of what is needed."),
      O("A Glue ETL job that splits the mixed table into three tables.", false, "A job to build and run for something the crawler setup solves."),
    ],
    r: "Crawler merged separate datasets into one partitioned table: separate include paths or the table level setting."
  },
  {
    id: "emr-glue-metastore", d: 2, t: "EMR",
    q: "A team runs transient EMR clusters whose Spark jobs create Hive tables. The tables disappear when a cluster terminates, and Athena cannot see them. The team wants one persistent, shared metastore with the LEAST operational overhead. What should they do?",
    o: [
      O("Table definitions exported to S3 as DDL scripts after each cluster run.", false, "Manual, and nothing shares them automatically."),
      O("An external Hive metastore running on an RDS MySQL instance.", false, "Persistent, but you operate a database, and Athena does not read it natively."),
      O("EMR configured to use the Glue Data Catalog as its Hive metastore.", true, "Tables outlive clusters and are visible to Athena, Spectrum and Glue."),
      O("The table data kept in HDFS on the core nodes of each cluster.", false, "HDFS data disappears with the cluster."),
    ],
    r: "Shared persistent metastore for EMR, Athena, Spectrum: the Glue Data Catalog as the Hive metastore."
  },
  {
    id: "ddb-gsi-new-access-pattern", d: 2, t: "DynamoDB",
    q: "An orders table has partition key customerId and sort key orderDate. A new dashboard must list orders with status SHIPPED from the last seven days across all customers, newest first. Orders have 40 attributes, but the dashboard shows five. The team wants a fast, cheap query without changing the existing access pattern. Which solution meets this?",
    o: [
      O("A Scan with a filter on status and date, run by the dashboard.", false, "Reads and charges for every item."),
      O("Streams into Aurora, with the dashboard querying the copy there.", false, "Works, but it adds a database and a pipeline."),
      O("A local secondary index on status, with orderDate as its sort key.", false, "An LSI keeps the table's partition key and can only be created with the table."),
      O("A GSI keyed on status and orderDate, projecting only the needed attributes.", true, "A GSI gives a new key schema for this query and can be created at any time."),
    ],
    r: "New access pattern on a different key: GSI (any time, own throughput). LSI: same partition key, only at table creation."
  },
  {
    id: "ddb-hot-partition-key", d: 2, t: "DynamoDB",
    q: "A DynamoDB table in on-demand mode stores IoT readings with partition key deviceType, which has only three values. During peaks the application is throttled even though the account's limits are far from reached. The team wants the throttling gone with the least redesign. What should they do?",
    o: [
      O("A high-cardinality partition key such as deviceId, or a random suffix on the key.", true, "More distinct key values spread the load over partitions."),
      O("Provisioned mode with a very high write capacity set on the table.", false, "Capacity is divided across partitions, and a hot key still caps out."),
      O("DAX placed in front of the table for the device writes.", false, "DAX caches reads. The throttling is on writes."),
      O("A global secondary index on deviceType for the device lookups.", false, "The index inherits the same hot key."),
    ],
    r: "Throttled with capacity to spare: hot partition key. Fix the key (high cardinality or write sharding), not the capacity."
  },
  {
    id: "ddb-ttl-archive-s3", d: 2, t: "DynamoDB",
    q: "Session items in a DynamoDB table should disappear after 30 days without using write capacity, but the company must keep an archive of the expired items in S3 for audits. The team wants the least custom code. Which solution meets these requirements?",
    o: [
      O("Point-in-time recovery enabled, with a monthly export to S3.", false, "Exports do not delete anything and copy everything, not just expired items."),
      O("TTL on an expiry attribute, with the table's stream read by EventBridge Pipes, filtered to TTL deletions and delivered through Firehose to S3.", true, "TTL deletes use no write capacity and show up in the stream as deletions by the DynamoDB service. A Pipes filter keeps only those, and Firehose delivers them to S3 with no code."),
      O("An on-demand backup taken every 30 days and kept in AWS Backup.", false, "Backups do not remove items."),
      O("A nightly Lambda function that scans for old items, copies them to S3 and deletes them.", false, "Scans and deletes use capacity and can hit time limits."),
    ],
    r: "Free expiry plus an archive: TTL, with the stream's TTL-delete events (filtered) sent on to S3."
  },
  {
    id: "ddb-export-athena", d: 2, t: "DynamoDB",
    q: "Analysts want to run ad hoc Athena queries over a 3 TB production DynamoDB table. The queries must not consume the table's read capacity or affect the application, and data that is a day old is acceptable. Which solution has the LEAST operational overhead?",
    o: [
      O("DynamoDB Streams delivered by Firehose to S3.", false, "Captures changes from now on, not the existing history."),
      O("Athena federated query with the DynamoDB connector.", false, "Reads the live table through a Lambda connector, using its capacity."),
      O("Scheduled PITR exports to S3, a Glue crawler and Athena.", true, "Exports read from the backup, so no capacity is used, and the output is queryable in S3."),
      O("A nightly Glue job that scans the table into S3.", false, "Scans consume read capacity unless carefully throttled."),
    ],
    r: "Analytics on DynamoDB without touching RCUs: export to S3 (needs PITR), then Athena."
  },
  {
    id: "calc-wcu-transact", d: 2, t: "Calculations",
    q: "A provisioned DynamoDB table receives 100 transactional writes per second (TransactWriteItems), and each item is about 3.5 KB. How many write capacity units are needed?",
    o: [
      O("400", false, "Rounds the item up correctly (4 WCU per write) but forgets that a transactional write costs double."),
      O("350", false, "Skips rounding the item size up to the next 1 KB and ignores the transaction cost."),
      O("1,400", false, "Does not match the calculation."),
      O("800", true, "3.5 KB rounds up to 4 KB, which is 4 WCU per write. A transactional write costs twice that: 8 WCU. Times 100 writes is 800."),
    ],
    r: "WCU: round the item up to 1 KB blocks, double it for transactions, multiply by writes per second."
  },
  {
    id: "iceberg-merge-timetravel", d: 2, t: "Athena",
    q: "A data lake stores order data as Parquet in S3. Finance now sends daily corrections including row updates and deletes, and auditors need to query the table as it was last quarter. Queries come from Athena, and the team wants to avoid rewriting whole partitions by hand. Which solution has the LEAST operational overhead?",
    o: [
      O("An Iceberg table with MERGE INTO corrections and time travel in Athena.", true, "Iceberg adds row-level changes and snapshot queries on top of S3."),
      O("The data loaded into DynamoDB and queried with PartiQL.", false, "A different store with no analytics scale for this data."),
      O("Parquet with the affected partitions rewritten by a daily CTAS.", false, "Rewrites whole partitions and offers no time travel."),
      O("Parquet with S3 versioning on, restoring old versions for audits.", false, "Versions of files, not a queryable table at a point in time."),
    ],
    r: "Row-level updates/deletes and time travel on S3: Apache Iceberg (Athena MERGE INTO, FOR TIMESTAMP AS OF)."
  },
  {
    id: "s3-glacier-instant", d: 2, t: "S3",
    q: "Medical images must be kept for ten years. Radiologists open an image only a few times a year, but when they do it must load in milliseconds. The access pattern is well known, and the company wants the lowest storage cost that meets this. Which solution is the MOST cost-effective?",
    o: [
      O("S3 Glacier Flexible Retrieval with expedited retrievals", false, "Expedited retrievals take minutes, not milliseconds."),
      O("S3 Glacier Instant Retrieval", true, "Archive pricing with millisecond access for rarely read data."),
      O("S3 Standard-IA", false, "Millisecond access, but a higher storage price than archive tiers for data read this rarely."),
      O("S3 Intelligent-Tiering", false, "Good for unknown patterns. For a known rare pattern it adds monitoring fees and a higher price."),
    ],
    r: "Rare access (quarterly) but instant read: Glacier Instant Retrieval. Flexible Retrieval takes minutes to hours."
  },
  {
    id: "s3-replication-existing", d: 2, t: "S3",
    q: "A bucket with 50 TB of existing objects must be copied to another Region for disaster recovery, and every new object must be replicated as well. Versioning is currently off. Which solution meets these requirements with the LEAST operational overhead?",
    o: [
      O("aws s3 sync from an EC2 instance every night between the buckets.", false, "Not continuous, and you run the instance."),
      O("A cross-Region replication rule on the bucket, with versioning enabled.", false, "It needs versioning, and a rule replicates new objects only, not existing ones."),
      O("Versioning on both buckets, a replication rule, and S3 Batch Replication for existing objects.", true, "Replication needs versioning. A rule covers new objects and Batch Replication copies the existing ones."),
      O("A nightly DataSync task copying between the two buckets.", false, "Works, but copies once a day instead of replicating each new object."),
    ],
    r: "Replication needs versioning and covers new objects only. Existing objects: S3 Batch Replication."
  },
  {
    id: "syn-unload-parquet-partition", d: 2, t: "Syntax", oc: true,
    q: "A data engineer must move sales rows older than 2023 out of Redshift to S3 as Parquet, partitioned by sale_date, so that Spectrum can still query them. Which statement is correct?",
    o: [
      O(`COPY sales
TO 's3://lake/sales/'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftUnload'
FORMAT AS PARQUET
PARTITION BY (sale_date);`, false, "COPY loads data into Redshift. Export is UNLOAD."),
      O(`UNLOAD ('SELECT * FROM sales WHERE sale_date < ''2023-01-01''')
TO 's3://lake/sales/'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftUnload'
FORMAT AS PARQUET
PARTITION BY sale_date;`, false, "PARTITION BY needs the column list in parentheses."),
      O(`UNLOAD ('SELECT * FROM sales WHERE sale_date < '2023-01-01'')
TO 's3://lake/sales/'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftUnload'
FORMAT AS PARQUET
PARTITION BY (sale_date);`, false, "Single quotes inside the quoted query must be doubled, otherwise the statement breaks."),
      O(`UNLOAD ('SELECT * FROM sales WHERE sale_date < ''2023-01-01''')
TO 's3://lake/sales/'
IAM_ROLE 'arn:aws:iam::123456789012:role/RedshiftUnload'
FORMAT AS PARQUET
PARTITION BY (sale_date);`, true, "Quotes inside the query string are doubled, and PARTITION BY takes a column list in parentheses."),
    ],
    r: "UNLOAD ('query') TO 's3://...' IAM_ROLE ... FORMAT AS PARQUET PARTITION BY (col). Double the quotes inside the query."
  },
  {
    id: "redshift-auto-table-optimization", d: 2, t: "Redshift",
    q: "A new analytics workload runs on Redshift tables whose query patterns are not yet known and change every month. The DBA team is small and cannot keep tuning distribution and sort keys. Which approach has the LEAST operational overhead?",
    o: [
      O("DISTSTYLE AUTO and SORTKEY AUTO, letting automatic table optimization adjust.", true, "Redshift picks and adapts keys from the observed workload."),
      O("Each table's primary key chosen as its DISTKEY at creation.", false, "A guess that does not follow how tables are joined and filtered."),
      O("DISTSTYLE ALL on every table, with sort keys chosen by the DBA.", false, "Copies large tables to every node, costing storage and load time."),
      O("DISTSTYLE EVEN on every table, with sort keys chosen by the DBA.", false, "Static, and it cannot colocate join keys."),
    ],
    r: "Unknown or shifting query patterns: DISTSTYLE AUTO / SORTKEY AUTO (automatic table optimization)."
  },
  {
    id: "redshift-ra3-growth", d: 2, t: "Redshift",
    q: "A Redshift cluster of dense compute nodes is running out of storage, but CPU use is around 20 percent and query performance is fine. Data volume is expected to double every year. The company wants the most cost-effective way to keep growing. What should the data engineer do?",
    o: [
      O("More dense compute nodes added with an elastic resize.", false, "Adds compute that is not needed, because DC2 ties storage to compute."),
      O("A migration to RA3 nodes with managed storage.", true, "Storage scales and is billed separately from compute, so only storage grows."),
      O("A move to Redshift Serverless with a base capacity set.", false, "Suits intermittent load. For a steady workload it usually costs more."),
      O("A switch to larger dense compute node types.", false, "Same coupling, more compute than needed."),
    ],
    r: "Storage grows, compute does not: RA3 with managed storage (decoupled). DC2 couples both."
  },
  {
    id: "redshift-reserved-steady", d: 2, t: "Redshift",
    q: "A company runs a provisioned RA3 cluster around the clock with a steady load, and expects to keep this workload for at least three years. Which option is the MOST cost-effective?",
    o: [
      O("Stay on On-Demand pricing and turn on concurrency scaling.", false, "Full price, and concurrency scaling adds capacity rather than lowering cost."),
      O("Move to Redshift Serverless.", false, "Pay-per-use fits intermittent load. A constant load costs more."),
      O("Purchase reserved nodes for the cluster.", true, "A one- or three-year commitment gives a large discount on steady usage."),
      O("Pause and resume the cluster on a schedule.", false, "The cluster is never idle, so there is nothing to pause."),
    ],
    r: "Steady 24/7 Redshift: reserved nodes. Intermittent or spiky: Serverless or pause/resume."
  },
  {
    id: "rds-proxy-lambda", d: 2, t: "RDS",
    q: "A Lambda function triggered by a Kinesis stream writes to Aurora MySQL. During spikes, hundreds of concurrent invocations each open connections, and the database reports too many connections while its CPU stays low. The team wants the smallest change that fixes this. What should they do?",
    o: [
      O("A larger Aurora instance class for more connection slots.", false, "More connection slots for more money, and the spikes would still pile up."),
      O("The data moved to DynamoDB, with the function rewritten.", false, "A large rewrite for a connection problem."),
      O("Reserved concurrency of 5 on the function to limit connections.", false, "Limits connections but cuts throughput, so the stream falls behind."),
      O("RDS Proxy between the function and the database.", true, "The proxy pools and shares database connections across invocations."),
    ],
    r: "Lambda opening too many database connections: RDS Proxy (connection pooling)."
  },
  {
    id: "aurora-snapshot-export", d: 2, t: "RDS",
    q: "Once a week, a full copy of an Aurora PostgreSQL database must be available in S3 as Parquet for Athena. The copy should not load the production cluster, and the team wants no custom extraction jobs. Which solution has the LEAST operational overhead?",
    o: [
      O("A scheduled export of a DB snapshot to S3.", true, "Exports from the snapshot to Parquet without touching the live cluster."),
      O("A read replica plus a Glue job.", false, "More pieces to run, and it still queries a database."),
      O("A DMS full-load task to S3.", false, "Reads from the source and needs a replication instance and task."),
      O("A Glue JDBC job reading from the writer instance.", false, "Runs analytic reads against production."),
    ],
    r: "Periodic full copy of Aurora or RDS to S3 as Parquet, no load: snapshot export to S3."
  },
  {
    id: "opensearch-ism-tiers", d: 2, t: "OpenSearch",
    q: "Application logs go to Amazon OpenSearch Service. The last 7 days are searched constantly, logs up to 90 days old are searched occasionally, and logs up to a year are kept for rare investigations. After a year they can be deleted. The company wants lower storage cost with the LEAST operational work. Which solution meets these requirements?",
    o: [
      O("Every index kept on hot nodes, with smaller instance types.", false, "Hot storage is the most expensive tier, and smaller nodes hurt search speed."),
      O("An ISM policy moving indexes from hot to UltraWarm to cold, then deleting them.", true, "Index lifecycle runs inside the service and cheaper tiers stay searchable."),
      O("A nightly Lambda function that snapshots and deletes old indexes.", false, "Custom code to maintain."),
      O("Old logs exported to S3 on a schedule and queried with Athena.", false, "Cheap, but old logs leave OpenSearch and you manage a second query path."),
    ],
    r: "Aging log indexes in OpenSearch: ISM policy, hot to UltraWarm to cold to delete."
  },
  {
    id: "opensearch-ingestion-pipeline", d: 2, t: "OpenSearch",
    q: "JSON application logs arrive in an S3 bucket. The team wants to drop DEBUG-level lines, parse a timestamp, and index the rest into Amazon OpenSearch Service continuously. They do not want to run servers or maintain custom code. Which solution has the LEAST operational overhead?",
    o: [
      O("A Lambda function per object that parses and bulk-indexes the lines.", false, "Custom code, and bulk indexing logic to maintain."),
      O("A scheduled Glue job writing to OpenSearch every hour with a connector.", false, "Batch, not continuous, and connector configuration to maintain."),
      O("An OpenSearch Ingestion pipeline from S3, with filter and parse processors.", true, "A managed pipeline for exactly this: read, process, and write to OpenSearch."),
      O("Logstash on an EC2 instance reading the bucket and filtering DEBUG lines.", false, "Works, but you run and patch the server."),
    ],
    r: "Managed ingest and transform into OpenSearch: OpenSearch Ingestion (managed Data Prepper)."
  },
  {
    id: "dax-microsecond-reads", d: 2, t: "DynamoDB",
    q: "A product catalog table in DynamoDB serves 200,000 reads per second, concentrated on a few thousand popular items. Single-digit-millisecond latency is too slow for the new checkout flow, which needs microseconds. The application uses the DynamoDB API and the team wants minimal code change. Which solution meets this?",
    o: [
      O("Add ElastiCache for Redis with cache-aside logic.", false, "Works, but needs code to populate and invalidate the cache."),
      O("Switch the table to on-demand capacity mode.", false, "Changes how capacity is billed, not latency."),
      O("Add a global secondary index.", false, "Does not make reads faster for repeated item lookups."),
      O("Place DAX in front of the table.", true, "A write-through cache that speaks the DynamoDB API and answers repeated reads in microseconds."),
    ],
    r: "Microsecond reads on DynamoDB with minimal code change: DAX. ElastiCache needs cache logic."
  },
  {
    id: "keyspaces-cassandra", d: 2, t: "Database",
    q: "A team wants to move a Cassandra application, which uses CQL and the standard Cassandra drivers, to AWS with minimal code changes and without operating a cluster. Which solution is the best fit?",
    o: [
      O("Use Amazon Keyspaces.", true, "Serverless and compatible with CQL and Cassandra drivers."),
      O("Run Cassandra on EC2 instances with EBS volumes.", false, "No code change, but you run the cluster."),
      O("Move to Amazon DocumentDB.", false, "MongoDB-compatible, not Cassandra-compatible."),
      O("Rewrite the data layer for DynamoDB.", false, "Serverless, but a rewrite from CQL to the DynamoDB API."),
    ],
    r: "Cassandra-compatible, serverless: Keyspaces. MongoDB-compatible: DocumentDB. Graph: Neptune."
  },
  {
    id: "scd-type2-redshift", d: 2, t: "Redshift",
    q: "A customer dimension in Redshift must show which address a customer had when each past order was placed. Addresses change several times a year, and analysts query both history and the current state. Which design is the best fit?",
    o: [
      O("The address updated in place on every change.", false, "Type 1 overwrites, so history is lost."),
      O("A new row per change with valid-from, valid-to and current-flag columns.", true, "Type 2 keeps full history, and orders join to the row valid on the order date."),
      O("The dimension kept current, relying on S3 versioning of source extracts.", false, "Not queryable as history inside the warehouse."),
      O("A previous_address column added next to the current address.", false, "Type 3 keeps only one earlier value."),
    ],
    r: "Keep dimension history: slowly changing dimension Type 2 (new row, valid-from/to, current flag)."
  },
  {
    id: "syn-athena-time-travel", d: 2, t: "Syntax", oc: true,
    q: "An Athena Iceberg table named sales_ice is updated throughout the day. An analyst wants to query it as it looked exactly 24 hours ago. Which statement does this?",
    o: [
      O(`SELECT * FROM sales_ice
AS OF (current_timestamp - interval '1' day);`, false, "Missing the FOR TIMESTAMP keywords."),
      O(`SELECT * FROM sales_ice
WHERE snapshot_time <= current_timestamp - interval '1' day;`, false, "Tables have no such column. Time travel is a clause, not a filter."),
      O(`SELECT * FROM sales_ice
FOR TIMESTAMP AS OF (current_timestamp - interval '1' day);`, true, "Athena's Iceberg time travel clause is FOR TIMESTAMP AS OF."),
      O(`SELECT * FROM sales_ice
FOR VERSION AS OF (current_timestamp - interval '1' day);`, false, "VERSION AS OF takes a snapshot ID, not a timestamp."),
    ],
    r: "Iceberg time travel in Athena: FOR TIMESTAMP AS OF <time> or FOR VERSION AS OF <snapshot id>."
  },
  {
    id: "s3-noncurrent-expiry", d: 2, t: "S3",
    q: "A versioned bucket receives daily overwrites of the same report files, and storage cost has tripled. Only the current version is used, but the company wants to be able to restore a previous version for up to 30 days. Which lifecycle configuration is the MOST cost-effective?",
    o: [
      O("Versioning suspended on the bucket, keeping the old versions.", false, "Existing old versions stay and keep costing, and rollback is lost."),
      O("All versions moved to Glacier Deep Archive right away by lifecycle.", false, "Long minimum storage charges and hours to restore, so rollback is impractical."),
      O("Current versions expired after 30 days by a lifecycle rule.", false, "Deletes the data the company still uses."),
      O("Noncurrent versions expired 30 days after they become noncurrent.", true, "Keeps a 30-day rollback window and removes the old versions that drive the cost."),
    ],
    r: "Versioned bucket cost creep: lifecycle rule to expire noncurrent versions after N days."
  },
  {
    id: "aws-backup-vault-lock", d: 2, t: "Backup",
    q: "A company needs daily backups of DynamoDB tables, RDS databases and EFS file systems across three accounts, copied to a second Region. Backups must not be deletable by anyone, including administrators, for 35 days. The team wants central management and the least custom code. Which solution meets these requirements?",
    o: [
      O("AWS Backup plans with cross-Region and cross-account copy, in a Vault Lock compliance vault.", true, "Central plans across services and accounts, and immutable backups for the lock period."),
      O("S3 Object Lock on exports of each service's data, copied across accounts.", false, "Not every service exports to S3, and it is not a backup service."),
      O("Lambda functions taking snapshots on a schedule and copying them across Regions.", false, "Custom code per service, and nothing prevents deletion."),
      O("Each service's own automated backups with 35-day retention.", false, "No central policy, and administrators can still delete backups."),
    ],
    r: "Central, cross-account, undeletable backups across services: AWS Backup with Vault Lock (compliance mode)."
  },
  {
    id: "pgvector-aurora", d: 2, t: "Database",
    q: "An e-commerce company stores product data in Aurora PostgreSQL. It wants semantic product search using embeddings generated from the product descriptions. The catalog has about 2 million products, query volume is modest, and the team wants to avoid adding another database to operate. Which solution has the LEAST operational overhead?",
    o: [
      O("Copy products to an OpenSearch Serverless vector collection with a sync pipeline.", false, "Capable, but a second store and a pipeline to keep it in sync."),
      O("Enable the pgvector extension in Aurora PostgreSQL and add an HNSW index on the embedding column.", true, "Vector search inside the database the data already lives in."),
      O("Embeddings stored in DynamoDB, with similarity computed in a Lambda function.", false, "DynamoDB has no vector search, so every query would scan items."),
      O("The products loaded into Neptune with similarity edges.", false, "A graph database, not built for embedding similarity search."),
    ],
    r: "Vector search with the data already in Aurora/RDS PostgreSQL: pgvector. Dedicated vector stores: OpenSearch k-NN, MemoryDB."
  },
  {
    id: "syn-redshift-external-schema", d: 2, t: "Syntax", oc: true,
    q: "A data engineer wants Redshift to query tables that are defined in the Glue Data Catalog database sales_db, with the data in S3. Which statement creates the external schema?",
    o: [
      O(`CREATE SCHEMA spectrum_sales
EXTERNAL DATABASE 'sales_db'
IAM_ROLE 'arn:aws:iam::123456789012:role/SpectrumRole';`, false, "Not valid syntax."),
      O(`CREATE EXTERNAL SCHEMA spectrum_sales
FROM DATA CATALOG
DATABASE 'sales_db';`, false, "An IAM role is required so Redshift can read the catalog and S3."),
      O(`CREATE EXTERNAL SCHEMA spectrum_sales
FROM DATA CATALOG
DATABASE 'sales_db'
IAM_ROLE 'arn:aws:iam::123456789012:role/SpectrumRole';`, true, "FROM DATA CATALOG with a database and an IAM role is the Spectrum external schema."),
      O(`CREATE EXTERNAL SCHEMA spectrum_sales
FROM HIVE METASTORE
DATABASE 'sales_db'
URI 'hive-host' PORT 9083
IAM_ROLE 'arn:aws:iam::123456789012:role/SpectrumRole';`, false, "That form points at a Hive metastore, for example on EMR, not the Glue Data Catalog."),
    ],
    r: "Spectrum: CREATE EXTERNAL SCHEMA ... FROM DATA CATALOG DATABASE '...' IAM_ROLE '...'."
  },
  {
    id: "syn-athena-projection-props", d: 2, t: "Syntax", oc: true,
    q: "Daily partitions arrive under s3://lake/events/dt=2024-01-01/ and so on. A data engineer wants Athena to find new partitions without a crawler or MSCK REPAIR TABLE. Which table properties do this?",
    o: [
      O(`TBLPROPERTIES (
 'projection.enabled'='true',
 'projection.dt.type'='integer',
 'projection.dt.format'='yyyy-MM-dd',
 'projection.dt.range'='2024-01-01,NOW',
 'storage.location.template'='s3://lake/events/dt=\${dt}/')`, false, "Dates need the date type, not integer."),
      O(`TBLPROPERTIES (
 'projection.enabled'='true',
 'projection.dt.type'='date',
 'projection.dt.format'='yyyy-MM-dd',
 'projection.dt.range'='2024-01-01',
 'storage.location.template'='s3://lake/events/dt=\${dt}/')`, false, "A date range needs a start and an end value, such as 2024-01-01,NOW."),
      O(`TBLPROPERTIES (
 'projection.dt.type'='date',
 'projection.dt.format'='yyyy-MM-dd',
 'projection.dt.range'='2024-01-01,NOW',
 'storage.location.template'='s3://lake/events/dt=\${dt}/')`, false, "Missing 'projection.enabled'='true', so projection is off."),
      O(`TBLPROPERTIES (
 'projection.enabled'='true',
 'projection.dt.type'='date',
 'projection.dt.format'='yyyy-MM-dd',
 'projection.dt.range'='2024-01-01,NOW',
 'storage.location.template'='s3://lake/events/dt=\${dt}/')`, true, "Enabled, a date type with format, a start-to-NOW range, and a location template."),
    ],
    r: "Partition projection needs projection.enabled=true, a type, format and range per column, and a location template."
  },
  {
    id: "syn-redshift-ddl-keys", d: 2, t: "Syntax", oc: true,
    q: "A fact table sales is joined to customers on customer_id and almost every query filters on a sale_date range. Which table definition fits best?",
    o: [
      O(`CREATE TABLE sales (
  sale_id BIGINT, customer_id INT,
  sale_date DATE, amount DECIMAL(10,2))
DISTSTYLE KEY DISTKEY (customer_id)
SORTKEY (sale_date);`, true, "DISTKEY on the join column colocates matching rows. SORTKEY on the filter column lets zone maps skip blocks."),
      O(`CREATE TABLE sales (
  sale_id BIGINT, customer_id INT,
  sale_date DATE, amount DECIMAL(10,2),
  INDEX (sale_date));`, false, "Redshift has no indexes."),
      O(`CREATE TABLE sales (
  sale_id BIGINT, customer_id INT,
  sale_date DATE, amount DECIMAL(10,2))
DISTSTYLE ALL
SORTKEY (sale_date);`, false, "ALL copies a large fact table to every node. It suits small dimensions."),
      O(`CREATE TABLE sales (
  sale_id BIGINT, customer_id INT,
  sale_date DATE, amount DECIMAL(10,2))
DISTSTYLE KEY DISTKEY (sale_date)
SORTKEY (customer_id);`, false, "Swapped: the join column should distribute, the filter column should sort."),
    ],
    r: "Redshift: DISTKEY = join column, SORTKEY = filter/range column, DISTSTYLE ALL = small dimension. No indexes."
  },
  {
    id: "file-formats-landing-analytics", d: 2, t: "Formats",
    q: "A pipeline lands events from a Kafka topic whose schema changes every few months. Producers write whole records, and the landing files must carry their schema with them. Later, analysts run Athena queries that read a few columns across billions of rows. Which file format choices fit best?",
    o: [
      O("CSV for the landing zone and CSV for analytics.", false, "No embedded schema or types, and it scans every column."),
      O("Avro for the landing zone and Parquet for analytics.", true, "Avro is row-based with an embedded, evolvable schema. Parquet is columnar and cheap to scan for a few columns."),
      O("JSON for the landing zone and ORC for analytics.", false, "JSON lacks an enforced schema, and ORC works but Parquet is the more widely supported columnar default."),
      O("Parquet for the landing zone and Parquet for analytics.", false, "Columnar files are awkward for record-at-a-time streaming writes, and Avro handles schema evolution there better."),
    ],
    r: "Row-based streaming with schema evolution: Avro. Columnar analytics: Parquet (or ORC)."
  },

  // ======================= DOMAIN 3 =======================
  {
    id: "syn-dqdl-composite", d: 3, t: "Syntax", oc: true,
    q: "A Glue Data Quality ruleset must enforce two things on the orders dataset. Every order_id must be present and unique. The coupon_code column may be empty, but when it has a value it must be exactly 8 characters long. The job evaluates composite rules row by row (the compositeRuleEvaluation.method option is set to ROW). Which ruleset is correct?",
    o: [
      O(`Rules = [
  IsComplete "order_id" and IsUnique "order_id",
  ColumnValues "coupon_code" = NULL or ColumnLength "coupon_code" = 8
]`, false, "Each rule inside a composite rule must be wrapped in parentheses."),
      O(`Rules = [
  (IsComplete "order_id") && (IsUnique "order_id"),
  (ColumnValues "coupon_code" = NULL) || (ColumnLength "coupon_code" = 8)
]`, false, "DQDL composite rules use the words and / or, not && and ||."),
      O(`Rules = [
  (IsComplete "order_id") and (IsUnique "order_id"),
  (ColumnValues "coupon_code" = NULL) or (ColumnLength "coupon_code" = 8)
]`, true, "Parenthesized rules joined with and / or. The NULL branch lets empty coupon codes pass."),
      O(`Rules = [
  IsComplete "order_id",
  IsUnique "order_id",
  ColumnLength "coupon_code" = 8
]`, false, "Rows with an empty coupon_code would fail the length rule."),
    ],
    r: "DQDL composite rules: (rule) and (rule), (rule) or (rule). Parentheses required. NULL-tolerant: add or (ColumnValues col = NULL)."
  },
  {
    id: "syn-dqdl-refintegrity", d: 3, t: "Syntax", oc: true,
    q: "In a Glue ETL job, the orders dataset is evaluated with Evaluate Data Quality, and a second dataset with the alias customers is supplied as reference data. At least 99 percent of the customer_id values in orders must exist in customers.customer_id. Which rule is correct?",
    o: [
      O(`ReferentialIntegrity "customer_id" "customers" >= 0.99`, false, "The reference needs a column part: alias.column."),
      O(`ColumnValues "customer_id" in customers.customer_id`, false, "ColumnValues takes a list or an expression, not a column from another dataset."),
      O(`DatasetMatch "customers" "customer_id" >= 0.99`, false, "DatasetMatch compares datasets through a key mapping and value columns, with different arguments."),
      O(`ReferentialIntegrity "customer_id" "customers.customer_id" >= 0.99`, true, "Primary column, then alias.column of the reference, then a ratio expression."),
    ],
    r: "Foreign-key style check: ReferentialIntegrity \"col\" \"refAlias.col\" >= ratio."
  },
  {
    id: "syn-dqdl-threshold", d: 3, t: "Syntax", oc: true,
    q: "A Glue Data Quality rule must pass when at least 95 percent of rows have a status of ACTIVE, INACTIVE or PENDING, so that a few bad rows do not fail the whole job. Which rule is correct?",
    o: [
      O(`ColumnValues "status" in ["ACTIVE","INACTIVE","PENDING"] with threshold >= 0.95`, true, "with threshold sets the share of rows that must satisfy the value rule."),
      O(`Uniqueness "status" >= 0.95`, false, "Measures the share of values that occur exactly once. Unrelated."),
      O(`ColumnValues "status" in ["ACTIVE","INACTIVE","PENDING"] >= 0.95`, false, "An in-expression cannot be compared with a ratio. The threshold needs its own clause."),
      O(`Completeness "status" >= 0.95`, false, "Measures the share of non-null values, not whether the values are allowed."),
    ],
    r: "Row-level rules that may partly fail: ColumnValues ... with threshold >= ratio. Completeness is about nulls."
  },
  {
    id: "syn-dqdl-rowcount-freshness", d: 3, t: "Syntax", oc: true,
    q: "A daily load into a Glue-managed table must contain between 10,000 and 50,000 rows, and every value in the date column load_ts must be at most 24 hours old. Which ruleset is correct?",
    o: [
      O(`Rules = [
  RowCount between 10000, 50000,
  DataFreshness "load_ts" <= 24 hours
]`, false, "between needs the word and between the two bounds."),
      O(`Rules = [
  RowCount between 10000 and 50000,
  DataFreshness "load_ts" <= 24 hours
]`, true, "between ... and ... for the range, and a time unit on the freshness expression."),
      O(`Rules = [
  RowCount between 10000 and 50000,
  DataFreshness "load_ts" <= 24
]`, false, "A DataFreshness expression needs a time unit such as hours or days."),
      O(`Rules = [
  RowCount in [10000, 50000],
  DataFreshness "load_ts" <= 24 hours
]`, false, "in matches the listed values only (10,000 or 50,000), not a range."),
    ],
    r: "RowCount between X and Y. DataFreshness col <= N hours|days (unit required)."
  },
  {
    id: "syn-dqdl-customsql", d: 3, t: "Syntax", oc: true,
    q: "In a Glue ETL job, the dataset under evaluation is available to SQL as primary. A rule must pass only when no row has a negative amount. Which rule is correct?",
    o: [
      O(`CustomSql select count(*) from primary where amount < 0 = 0`, false, "The SQL statement must be enclosed in double quotes."),
      O(`CustomSql "select * from primary where amount < 0" = 0`, false, "The statement must return a single numeric value, not rows."),
      O(`CustomSql "select count(*) from primary where amount < 0" = 0`, true, "Quoted SQL returning one number, compared with an expression."),
      O(`CustomSql "select count(*) from orders where amount < 0" = 0`, false, "In an ETL job the evaluated dataset is called primary, not by its table name."),
    ],
    r: "CustomSql \"<sql returning one number>\" <expression>. The evaluated dataset is called primary."
  },
  {
    id: "dq-rowlevel-quarantine", d: 3, t: "Glue",
    q: "A Glue Studio job loads finance transactions into a curated table. Roughly 1 percent of rows break quality rules such as a missing account ID. The company wants the good rows loaded on time, the bad rows kept separately for review, and the job not to fail. Which solution has the LEAST development effort?",
    o: [
      O("Hand-written Spark filters that route rows for each rule.", false, "Works, but it is code you maintain."),
      O("The job set to fail when any rule fails, rerun after the source is fixed.", false, "Blocks the 99 percent of good rows."),
      O("A Data Quality task on the curated table after the load, deleting failing rows.", false, "Bad rows reach the curated table first."),
      O("An Evaluate Data Quality node, splitting row-level outcomes into curated and quarantine outputs.", true, "Row-level outcomes flag each row, so the flow can route good and bad rows without failing."),
    ],
    r: "Keep good rows flowing and quarantine bad ones: Evaluate Data Quality with row-level outcomes, then split."
  },
  {
    id: "dq-recommend-rules", d: 3, t: "Glue",
    q: "A governance team inherits 300 Data Catalog tables with no quality checks. They want a starting ruleset for each table without writing every rule from scratch, and then plan to adjust the rules by hand. Which solution has the LEAST effort?",
    o: [
      O("Glue Data Quality's recommend rules on each table, giving a DQDL starting ruleset.", true, "Generates a starting ruleset from the data, ready to edit."),
      O("DQDL rulesets written by hand from each table's schema and a sample.", false, "Works, but is the most effort."),
      O("A custom Deequ analysis running on an EMR cluster.", false, "Works, but you run the cluster and write the code."),
      O("A DataBrew profile job per table, with the results converted by hand.", false, "Profile output is not DQDL, so conversion is manual."),
    ],
    r: "Baseline DQDL rules without writing them: Glue Data Quality recommendation (profiles the table)."
  },
  {
    id: "syn-dqdl-dynamic", d: 3, t: "Syntax", oc: true,
    q: "A table's daily row count rises and falls with the seasons, so a fixed RowCount threshold keeps raising false alarms. In a Glue ETL job the team wants a rule that passes when today's count is above 80 percent of the average of the last ten runs. Which rule is correct?",
    o: [
      O(`RowCount >= 0.8 * previous`, false, "previous is not a DQDL keyword."),
      O(`RowCount > avg(last(10)) * 0.8`, true, "A dynamic rule compares today's value with an aggregate of the last ten evaluations."),
      O(`RowCount > average(last(10)) * 0.8`, false, "The DQDL function is avg, not average."),
      O(`RowCount > avg(10) * 0.8`, false, "avg needs last(n) as its argument."),
    ],
    r: "Dynamic DQDL rules compare with history: avg(last(n)), min(last(n)), max(last(n)). ETL jobs only."
  },
  {
    id: "syn-logs-insights-bin", d: 3, t: "Syntax", oc: true,
    q: "A Glue job's log group in CloudWatch Logs holds thousands of lines. An engineer wants to count the lines containing ERROR in five-minute intervals with Logs Insights. Which query does this?",
    o: [
      O(`fields @timestamp, @message
| filter @message like /ERROR/
| count(*) by bin(5m)`, false, "count needs the stats command: stats count(*) by bin(5m)."),
      O(`filter @message = "ERROR"
| stats count(*) by bin(5m)`, false, "= only matches messages that equal ERROR exactly. Use like with a pattern."),
      O(`fields @timestamp, @message
| filter @message like /ERROR/
| stats count(*) as errors by bin(5m)`, true, "Filter, then aggregate with stats, grouped in five-minute bins."),
      O(`filter @message like /ERROR/
| stats count(*) groupBy 5m`, false, "groupBy is not Logs Insights syntax. Use by bin(5m)."),
    ],
    r: "Logs Insights: fields / filter / stats ... by bin(5m) / sort / limit. Pipe-separated commands."
  },
  {
    id: "syn-logs-insights-slowest", d: 3, t: "Syntax", oc: true,
    q: "An engineer needs the ten slowest invocations of a Lambda function over the last day from its log group in Logs Insights. Which query is correct?",
    o: [
      O(`filter @type = "REPORT"
| sort @duration
| limit 10`, false, "Sorts ascending, so these are the ten fastest."),
      O(`filter @type = "REPORT"
| order by @duration desc
| limit 10`, false, "order by is not Logs Insights syntax. The command is sort."),
      O(`fields @requestId, @duration
| limit 10
| sort @duration desc`, false, "limit runs first, so it sorts just ten arbitrary events."),
      O(`filter @type = "REPORT"
| fields @requestId, @duration
| sort @duration desc
| limit 10`, true, "Filter the REPORT lines, sort by duration descending, then limit."),
    ],
    r: "Order of commands matters in Logs Insights: sort first, then limit. Lambda REPORT lines expose @duration, @maxMemoryUsed."
  },
  {
    id: "cw-metric-filter-alarm", d: 3, t: "Monitoring",
    q: "An application writes a JSON line such as {\"batch\":\"b17\",\"rowsRejected\":733} to its CloudWatch log group after each batch. The on-call team wants a page when the total of rowsRejected exceeds 500 in any five-minute period. The team wants the least custom code. Which solution meets this?",
    o: [
      O("A metric filter extracting rowsRejected, a CloudWatch alarm on its sum, and SNS.", true, "Metric filters turn a JSON field into a metric, and an alarm on the 5-minute sum notifies through SNS."),
      O("A subscription filter to Firehose and S3, with a scheduled Athena query.", false, "Several services, and the alert would be delayed."),
      O("A saved Logs Insights query that an engineer runs each morning.", false, "Manual, not an alert."),
      O("A scheduled Lambda function running a Logs Insights query and publishing to SNS.", false, "Works, but it is code and a schedule to maintain."),
    ],
    r: "Alert on a value inside log lines: metric filter, then CloudWatch alarm, then SNS."
  },
  {
    id: "syn-eventbridge-glue-failure", d: 3, t: "Syntax", oc: true,
    q: "The on-call team must receive an SNS notification whenever any Glue job fails or times out. The team wants an event-driven solution. Which EventBridge event pattern matches?",
    o: [
      O(`{"source":["aws.glue"],
 "detail-type":["Glue Job State Change"],
 "detail":{"state":["FAILED"]}}`, false, "Misses jobs that end in TIMEOUT."),
      O(`{"source":["aws.glue"],
 "detail-type":["Glue Job State Change"],
 "detail":{"state":["FAILED","TIMEOUT"]}}`, true, "Glue emits job state change events, and the state values cover both failure endings."),
      O(`{"source":["aws.databrew"],
 "detail-type":["DataBrew Job State Change"],
 "detail":{"state":["FAILED","TIMEOUT"]}}`, false, "aws.databrew events come from DataBrew jobs. Glue ETL jobs emit from aws.glue."),
      O(`{"source":["aws.cloudtrail"],
 "detail-type":["AWS API Call via CloudTrail"],
 "detail":{"eventName":["StartJobRun"]}}`, false, "Matches when runs are started, not when they fail."),
    ],
    r: "Notify on Glue job failure: EventBridge rule on Glue Job State Change (FAILED, TIMEOUT) to SNS."
  },
  {
    id: "lambda-kinesis-poison-record", d: 3, t: "Lambda",
    q: "A Lambda function reads a Kinesis stream. One malformed record makes the function fail every time, and IteratorAge on that shard keeps climbing while the other shards are fine. Lambda keeps retrying the same batch until the record expires from the stream. The team wants the pipeline to keep moving and to keep the bad records for review. What should they do?",
    o: [
      O("A higher parallelization factor on the event source mapping.", false, "Within a shard the failing batch still blocks the records behind it."),
      O("More reserved concurrency for the function and a larger batch size.", false, "Concurrency is not the limit. The batch fails regardless."),
      O("Bisect on error, limits on retries and record age, and an on-failure destination.", true, "Bisecting isolates the bad record, limits the retries, and parks the failed record's details for review."),
      O("More shards added to the stream by splitting the busy shard.", false, "The poison record still sits in one shard and blocks it."),
    ],
    r: "Poison record blocking a shard: BisectBatchOnFunctionError + MaximumRetryAttempts/RecordAge + on-failure destination."
  },
  {
    id: "redshift-load-errors", d: 3, t: "Redshift",
    q: "A Redshift COPY from S3 fails with a message to check the load error system table. The data engineer needs the offending file, line number and reason. Where should they look?",
    o: [
      O("Redshift audit logs in S3 queried with Athena.", false, "Audit logs cover connections and activity, not per-row load errors."),
      O("The CPUUtilization metric in CloudWatch.", false, "A performance metric with no detail about rejected rows."),
      O("CloudTrail events for the COPY call.", false, "CloudTrail records the API caller and parameters, not row-level load errors."),
      O("The STL_LOAD_ERRORS system table in Redshift.", true, "Lists the file, line, column and reason for each rejected row. SYS_LOAD_ERROR_DETAIL is the newer equivalent."),
    ],
    r: "COPY failures: query STL_LOAD_ERRORS (or SYS_LOAD_ERROR_DETAIL) for file, line and reason."
  },
  {
    id: "redshift-explain-dist-both", d: 3, t: "Redshift",
    q: "A report that joins two tables of about 2 billion rows each on order_id is slow. The EXPLAIN output is shown. What should the data engineer change to improve it the MOST?",
    code: `XN Hash Join DS_DIST_BOTH  (cost=2210000.00..)
  Outer Dist Key: orders.order_id
  Inner Dist Key: line_items.order_id
  Hash Cond: ("outer".order_id = "inner".order_id)
  ->  XN Seq Scan on orders
  ->  XN Seq Scan on line_items`,
    o: [
      O("Make order_id the DISTKEY of both tables.", true, "Rows with the same order_id then sit on the same slice, so the join needs no redistribution."),
      O("Add a sort key on order_id to both tables.", false, "Helps scans and merge joins, but the data is still redistributed."),
      O("Run VACUUM and ANALYZE on both tables.", false, "Reclaims space and resorts rows. It does not change the distribution."),
      O("Change orders to DISTSTYLE ALL.", false, "Copies a 2-billion-row table to every node."),
    ],
    r: "DS_DIST_BOTH or DS_BCAST_INNER on big joins: set a matching DISTKEY on the join column. DS_DIST_NONE is the goal."
  },
  {
    id: "redshift-concurrency-scaling", d: 3, t: "Redshift",
    q: "Every weekday at 9 AM, dozens of analysts open dashboards that query a Redshift RA3 cluster, and queries queue for minutes. The rest of the day the cluster is lightly used. The company does not want to resize the cluster or change the analysts' queries. Which solution is the MOST cost-effective?",
    o: [
      O("Use elastic resize to double the node count during working hours.", false, "Pays for the extra nodes all day and the resize is disruptive."),
      O("Enable concurrency scaling on the WLM queue.", true, "Extra transient capacity is added automatically for queued queries, with daily free credits, and removed afterwards."),
      O("Create a second cluster fed by a datashare for the analysts.", false, "Works, but a second cluster to pay for and manage."),
      O("Migrate the workload to Redshift Serverless.", false, "A migration project for a peak that concurrency scaling absorbs."),
    ],
    r: "Short peaks of queued queries on Redshift: concurrency scaling (and short query acceleration) rather than a resize."
  },
  {
    id: "redshift-vacuum-unsorted", d: 3, t: "Redshift", oc: true,
    q: "A Redshift table has seen heavy updates and deletes over the past weeks, and queries against it have slowed. The SVV_TABLE_INFO output for the table is shown. Which statement should the data engineer run?",
    code: `table   | tbl_rows    | unsorted | stats_off
orders  | 812,000,000 | 46.2     | 3.1`,
    o: [
      O("TRUNCATE orders;", false, "Deletes all the data."),
      O("ANALYZE orders;", false, "stats_off is low, so statistics are fine. The problem is unsorted rows."),
      O("VACUUM FULL orders;", true, "Reclaims deleted-row space and re-sorts. 46 percent unsorted is the problem."),
      O("ALTER TABLE orders ALTER DISTSTYLE ALL;", false, "Copies a table with 800 million rows to every node. Not related to unsorted rows."),
    ],
    r: "SVV_TABLE_INFO: high unsorted means VACUUM. High stats_off means ANALYZE."
  },
  {
    id: "athena-partition-schema-mismatch", d: 3, t: "Glue",
    q: "After a schema change, a crawler updated the table so that amount is a double. Older partitions still carry the original int definition, and Athena queries fail with HIVE_PARTITION_SCHEMA_MISMATCH. The team wants this fixed with the least manual work, including for future changes. What should the data engineer do?",
    o: [
      O("Each old partition dropped and recreated with ALTER TABLE.", false, "Manual work, and it repeats with the next change."),
      O("MSCK REPAIR TABLE run on the table after each crawl.", false, "Adds missing partitions. It does not change the schema of existing ones."),
      O("The crawler set to ignore schema changes from now on.", false, "Stops further updates but leaves the current mismatch in place."),
      O("The crawler set to update all new and existing partitions from the table metadata.", true, "Existing partitions inherit the table's schema each run, so they stay consistent."),
    ],
    r: "HIVE_PARTITION_SCHEMA_MISMATCH: partitions differ from the table. Crawler option: update existing partitions with table metadata."
  },
  {
    id: "quicksight-spice-nightly", d: 3, t: "QuickSight",
    q: "Fifty executives open a QuickSight dashboard that runs direct queries against a 10 TB Athena table every morning, and each load repeats the same expensive queries. Athena costs are rising and the dashboards are slow. Data only needs to be current as of the previous night. Which solution is the MOST cost-effective?",
    o: [
      O("A SPICE import of the dataset with a nightly refresh.", true, "One scan per night, and dashboard loads run on SPICE's in-memory engine."),
      O("The table converted to Parquet, keeping direct query.", false, "Reduces bytes scanned, but every dashboard load still queries Athena."),
      O("Athena query result reuse turned on for the dashboards.", false, "Helps only identical queries within the reuse window, not different filters and visuals."),
      O("Athena provisioned capacity bought for the morning peak.", false, "Predictable, but always-on DPUs cost money for a morning peak."),
    ],
    r: "Dashboards repeating the same queries on data that updates nightly: QuickSight SPICE with a scheduled refresh."
  },
  {
    id: "cwl-retention-subscription", d: 3, t: "Monitoring",
    q: "Debug logs in CloudWatch Logs are costing too much. They must stay searchable in CloudWatch for 14 days, and a cheap copy must be kept in S3 for a year for audits. This should run continuously with the least custom code. Which solution meets these requirements?",
    o: [
      O("A Lambda function reading logs through the API daily and writing to S3.", false, "Custom code to maintain, with API limits."),
      O("14-day log group retention plus a subscription filter to Firehose and S3 with a one-year lifecycle.", true, "Retention removes old logs from CloudWatch, the subscription streams every event to S3, and lifecycle expires them after a year."),
      O("Logs kept in CloudWatch indefinitely, with a lower log level.", false, "Storage cost stays and the audit copy is not cheap."),
      O("CreateExportTask to S3 once a month, with lifecycle rules on the bucket.", false, "A batch export with delay, and you must schedule it."),
    ],
    r: "Short CloudWatch retention plus a cheap long archive: log group retention + subscription filter to Firehose to S3."
  },
  {
    id: "cost-allocation-tags", d: 3, t: "Cost",
    q: "Finance wants monthly Glue, Athena and EMR costs per team. Resources already carry a team tag. The data engineer wants the least effort to produce a per-team breakdown. What should she do?",
    o: [
      O("Cost Anomaly Detection turned on with a monitor per service.", false, "Detects unusual spend, not spend by team."),
      O("A budget created for each team, filtered by the team tag.", false, "Budgets alert on thresholds. They do not produce a breakdown."),
      O("Team activated as a cost allocation tag, then grouped in Cost Explorer.", true, "Once activated, the tag becomes a grouping option in Cost Explorer."),
      O("A Cost and Usage Report delivered to S3 and queried with Athena.", false, "Works, but more setup than a built-in view."),
    ],
    r: "Cost per team: activate cost allocation tags, group by tag in Cost Explorer. Budgets alert, Cost Explorer analyzes."
  },
  {
    id: "budgets-forecast-alert", d: 3, t: "Cost",
    q: "A manager wants an email as soon as the forecast for this month's Redshift spend is expected to pass $5,000, before it actually happens. Which solution has the LEAST operational overhead?",
    o: [
      O("A saved Cost Explorer report filtered to Redshift, reviewed weekly.", false, "A view, with no alerting."),
      O("Cost Anomaly Detection monitoring the Redshift service.", false, "Alerts on unusual patterns, not on a threshold forecast."),
      O("A CloudWatch billing alarm on EstimatedCharges with an SNS topic.", false, "Alarms on charges so far, not on a forecast."),
      O("An AWS Budgets cost budget for Redshift with an alert on forecasted spend.", true, "Budgets compares forecasted spend with the threshold and emails."),
    ],
    r: "Alert before the money is spent: AWS Budgets with a forecasted-spend alert. Cost Explorer = analysis."
  },
  {
    id: "glue-skewed-join", d: 3, t: "Glue",
    q: "In a Glue Spark job, a join finishes 99 percent of its tasks in seconds, but one task runs for 40 minutes and the job then fails with out-of-memory errors. The Spark UI shows that a single join key value (country = US) accounts for most of the rows. The team wants the job to run reliably. What should they do?",
    o: [
      O("Salting the skewed key, or repartitioning on a higher-cardinality column before the join.", true, "Spreads the dominant key's rows over many tasks."),
      O("Job bookmarks turned on for the job, with the same workers.", false, "Bookmarks track processed input, not data distribution."),
      O("More G.1X workers added to the job through auto scaling.", false, "The huge key still lands on a single task, so the other workers sit idle."),
      O("The job rewritten as a Python shell job on a single node.", false, "Single node and no Spark, which makes a large join worse."),
    ],
    r: "One straggler task = data skew. Fix the key distribution (salting, repartition), not the worker count."
  },
  {
    id: "mwaa-worker-scaling", d: 3, t: "Orchestration",
    q: "An MWAA environment runs a DAG that fans out to 200 parallel tasks each morning. The tasks sit queued for long periods, worker CPU is saturated, and the DAG misses its deadline. The team wants to fix throughput with the least change to the DAG. What should they do?",
    o: [
      O("The DAG rewritten as a Step Functions state machine.", false, "A rewrite instead of a capacity change."),
      O("A larger environment class and a higher maximum worker count.", true, "More worker capacity runs the queued tasks in parallel. The DAG is unchanged."),
      O("Only the DAG's concurrency setting raised, with the same workers.", false, "Lets more tasks start, but the saturated workers cannot run them."),
      O("More DPUs added to the Glue jobs the tasks call.", false, "The tasks are queued on MWAA workers before they ever reach Glue."),
    ],
    r: "MWAA tasks queued with busy workers: scale the environment class and max workers."
  },
  {
    id: "sqs-dlq-redrive", d: 3, t: "Messaging",
    q: "After fixing a bug in a Lambda consumer, a team wants to send 40,000 messages from an SQS dead-letter queue back to the original queue for reprocessing, with the least effort and no custom code. What should they do?",
    o: [
      O("The DLQ purged, with producers asked to resend.", false, "Loses messages and creates work for others."),
      O("A Lambda function that reads the DLQ and sends to the source queue.", false, "Works, but is code for a built-in feature."),
      O("The DLQ redrive feature moving the messages to the source queue.", true, "A managed message move task from the DLQ to the source queue."),
      O("The DLQ added as a second event source of the consumer function.", false, "Reprocesses them, but outside the normal path and with its own retry behavior."),
    ],
    r: "Replay dead-lettered SQS messages after a fix: DLQ redrive to the source queue."
  },
  {
    id: "dms-data-validation", d: 3, t: "Migration",
    q: "After a DMS migration of a 10 TB database to Aurora, auditors require evidence that rows match between source and target in every table, including changes captured during replication. The team wants the least extra work. What should they do?",
    o: [
      O("COUNT(*) comparisons run with scripts on both databases.", false, "Counts do not prove the contents match, and the scripts are manual."),
      O("A search of CloudTrail for the migration task's events.", false, "Shows who ran what, not whether the data matches."),
      O("A Glue crawler run on both databases to compare schemas.", false, "Compares structure, not rows."),
      O("Data validation enabled on the DMS task, reviewing its results.", true, "DMS compares source and target data, including ongoing changes, and reports mismatches."),
    ],
    r: "Prove source and target rows match after DMS: enable DMS data validation on the task."
  },
  {
    id: "glue-small-files-driver-oom", d: 3, t: "Glue",
    q: "A Glue job reads eight million tiny JSON files from one S3 prefix and fails with a driver out-of-memory error before processing starts. The executors are barely used. The team wants the job to complete without changing the source layout. What should they do?",
    o: [
      O("groupFiles set to inPartition with a groupSize, plus the S3 list implementation option.", true, "Groups many small files into larger read tasks and lists S3 in a memory-friendlier way."),
      O("A coalesce on the DynamicFrame right after reading.", false, "The failure happens during listing and reading, before the coalesce."),
      O("A longer job timeout with the same worker type.", false, "The job fails on memory, not time."),
      O("A switch to G.2X workers for more memory.", false, "More memory per worker, but millions of file entries can still overwhelm the driver, at higher cost."),
    ],
    r: "Millions of small files in Glue: groupFiles/groupSize (and useS3ListImplementation). Better still: compact them."
  },
  {
    id: "athena-workgroup-data-limit", d: 3, t: "Athena",
    q: "An analyst accidentally ran an Athena query that scanned 80 TB and produced a large bill. The company wants any query that would scan more than 2 TB to be cancelled automatically, and a notification when a team's daily scanning passes a threshold. Which solution has the LEAST operational overhead?",
    o: [
      O("An AWS Budgets alert on Athena spend with an SNS email.", false, "Reacts after the cost accrues and does not cancel queries."),
      O("A workgroup per-query data limit, with a usage alert through CloudWatch and SNS.", true, "Athena cancels queries over the limit and can alert on cumulative scanned data."),
      O("A Lambda function polling running queries and stopping the large ones.", false, "Custom polling code that may act too late."),
      O("An IAM policy limiting who can call StartQueryExecution in the account.", false, "IAM cannot limit by the amount of data scanned."),
    ],
    r: "Stop runaway Athena scans: workgroup per-query data limit, plus workgroup alerts for daily or hourly totals."
  },
  {
    id: "athena-small-files-compaction", d: 3, t: "Athena",
    q: "Athena queries on a table of 3 million JSON files of about 50 KB each are slow, and most of the time goes to listing and opening files. New data arrives hourly. The team wants faster and cheaper queries with the LEAST ongoing effort. What should they do?",
    o: [
      O("A higher workgroup concurrency limit for the dashboard queries.", false, "More parallel queries do not fix the per-query file overhead."),
      O("Partitioning the table by minute to narrow each scan.", false, "Creates even more tiny files and partitions."),
      O("A scheduled Glue job or CTAS compacting new data into 128 MB+ Parquet, partitioned by date.", true, "Fewer, larger, columnar files reduce listing, opening and scanning."),
      O("Query result reuse turned on for the workgroup, with a longer window.", false, "Helps only repeated identical queries."),
    ],
    r: "Slow Athena on tiny files: compact into larger columnar files (Parquet, 128 MB+), partitioned sensibly."
  },
  {
    id: "redshift-mv-autorefresh", d: 3, t: "Redshift",
    q: "A dashboard runs the same heavy join-and-aggregate query against Redshift tables all day. New data is loaded every 30 minutes, and results must reflect each load, so the query result cache is of little help. The team wants the dashboard faster with the least maintenance. Which solution meets this?",
    o: [
      O("A regular view defined over the aggregate query.", false, "A view stores no results, so the heavy query still runs every time."),
      O("A Lambda function rebuilding a summary table every 30 minutes.", false, "Works, but is custom code and a schedule to maintain."),
      O("Concurrency scaling enabled on the dashboard queue.", false, "Adds capacity for concurrent queries but does not make this query cheaper."),
      O("A materialized view with auto refresh over the aggregate query.", true, "Precomputed results that Redshift refreshes after base data changes."),
    ],
    r: "Repeated heavy aggregate on changing data: materialized view with auto refresh. Result cache is invalidated by new data."
  },

  // ======================= DOMAIN 4 =======================
  {
    id: "lf-tag-based-access", d: 4, t: "Lake Formation",
    q: "A lake has 600 cataloged tables owned by many teams. Tables and columns are labeled by sensitivity (public, internal, pii) and by business domain. The security team wants analysts to read everything labeled public or internal in the sales domain, with the rules covering newly created tables automatically. Which solution has the LEAST operational overhead?",
    o: [
      O("LF-tags on databases, tables and columns, with grants on tag expressions.", true, "Tag-based grants apply to anything carrying the matching tags, including new tables."),
      O("S3 bucket policies per domain prefix for the analyst roles.", false, "Prefixes cannot express column sensitivity."),
      O("SELECT granted on each named table to the analyst roles.", false, "Works, but every new table needs a new grant."),
      O("IAM policies with resource-tag conditions on the Glue tables.", false, "No column-level control, and the policies multiply."),
    ],
    r: "Scalable data lake permissions: Lake Formation tag-based access control (LF-tags) instead of per-table grants."
  },
  {
    id: "lf-cross-account-share", d: 4, t: "Lake Formation",
    q: "The platform account owns a Glue Data Catalog database governed by Lake Formation. Analysts in another account must query two of its tables with Athena and see only the non-PII columns. The platform team does not want to copy data. Which solution meets these requirements?",
    o: [
      O("The bucket replicated into the analysts' account.", false, "Copies the data, and the copy has no column control."),
      O("Lake Formation column grants to the account, then resource links for analyst roles.", true, "Cross-account Lake Formation grants plus resource links let Athena query the shared tables with the column restrictions."),
      O("A Glue Data Catalog resource policy for the other account.", false, "Works at table level only. It cannot hide columns."),
      O("A cross-account bucket policy and a crawler in the analysts' account.", false, "The crawler would register everything it can read, so column-level control is lost."),
    ],
    r: "Cross-account catalog sharing with column control: Lake Formation grant to the account, then a resource link on the receiving side."
  },
  {
    id: "lf-register-location", d: 4, t: "Lake Formation",
    q: "Analysts hold Lake Formation SELECT on a catalog table, and their IAM roles deliberately have no S3 permissions. Athena queries still fail with an S3 access denied error. The security team wants data access to stay managed in Lake Formation. What should the data engineer do?",
    o: [
      O("Give the IAMAllowedPrincipals group access to the table.", false, "Hands control back to IAM-only access."),
      O("Grant the analysts the DATA_LOCATION_ACCESS permission.", false, "That governs who may create tables on a location, not who reads."),
      O("Register the table's S3 location with Lake Formation.", true, "A registered location lets Lake Formation vend access to the data for permitted principals."),
      O("Add s3:GetObject on the bucket to the analysts' IAM roles.", false, "Works, but defeats the centralized control the team wants."),
    ],
    r: "LF permissions but S3 access denied: the S3 location is not registered with Lake Formation."
  },
  {
    id: "kms-cross-account-cmk", d: 4, t: "KMS",
    q: "Account A stores curated data in S3 encrypted with SSE-KMS using the AWS managed key aws/s3. A partner in account B must read the objects with Athena. The bucket policy already allows account B, but reads fail with access denied on the KMS key. The company wants to keep KMS key use auditable. What should the data engineer do?",
    o: [
      O("A KMS grant on the aws/s3 key for the partner role in account B.", false, "An AWS managed key cannot be opened up to another account."),
      O("Account B added to the key policy of the aws/s3 managed key.", false, "The policy of an AWS managed key cannot be edited."),
      O("The bucket default encryption switched to SSE-S3 for all new objects.", false, "Works across accounts, but gives up the KMS control and auditing the company wants."),
      O("Objects re-encrypted with a customer managed key that allows account B.", true, "Only customer managed keys can be shared across accounts, and use stays visible in CloudTrail."),
    ],
    r: "Cross-account SSE-KMS reads need a customer managed key: key policy for the other account plus kms:Decrypt on its role."
  },
  {
    id: "s3-bucket-keys", d: 4, t: "KMS",
    q: "A bucket with 300 million small objects uses SSE-KMS. The KMS bill is high, and PUT requests sometimes get throttled by KMS. The company must keep KMS-based encryption and CloudTrail auditing of key use. Which change is the MOST effective?",
    o: [
      O("Enable S3 Bucket Keys.", true, "A bucket-level key cuts KMS requests dramatically while keeping SSE-KMS."),
      O("Ask for a higher KMS request quota.", false, "Avoids throttling but does not reduce the cost."),
      O("Switch to client-side encryption with KMS data keys.", false, "Still makes KMS calls per object, plus code."),
      O("Switch the bucket to SSE-S3.", false, "Removes the KMS control and auditing that the company must keep."),
    ],
    r: "SSE-KMS cost or throttling at high object counts: S3 Bucket Keys."
  },
  {
    id: "iam-db-auth-proxy", d: 4, t: "IAM",
    q: "A Lambda function reads from an Aurora MySQL database. Security policy forbids storing any database password, even in a secrets store or an environment variable. The team wants the least operational overhead. Which solution meets this?",
    o: [
      O("The password stored in Parameter Store as a SecureString and read at start.", false, "A password is still stored."),
      O("IAM database authentication from the function, using its role with rds-db:connect.", true, "The function gets a short-lived authentication token with its IAM role, so no database password is stored."),
      O("The password stored in Secrets Manager with automatic rotation enabled.", false, "A password still exists and is stored."),
      O("The password encrypted with KMS and kept in an environment variable.", false, "Still a stored password."),
    ],
    r: "No stored database passwords: IAM database authentication (rds-db:connect, short-lived tokens)."
  },
  {
    id: "syn-bucket-policy-vpce", d: 4, t: "Syntax", oc: true,
    q: "A bucket must be reachable only from workloads in the company's VPC through its S3 gateway endpoint vpce-0abc123. Which bucket policy statement enforces that?",
    o: [
      O(`{"Effect":"Allow","Principal":"*","Action":"s3:*",
 "Resource":["arn:aws:s3:::lake-bucket","arn:aws:s3:::lake-bucket/*"],
 "Condition":{"StringEquals":{"aws:SourceVpce":"vpce-0abc123"}}}`, false, "An Allow adds access but does not remove access that other policies grant from outside the VPC."),
      O(`{"Effect":"Deny","Principal":"*","Action":"s3:*",
 "Resource":["arn:aws:s3:::lake-bucket","arn:aws:s3:::lake-bucket/*"],
 "Condition":{"StringEquals":{"aws:SourceVpce":"vpce-0abc123"}}}`, false, "StringEquals denies requests that DO come through the endpoint."),
      O(`{"Effect":"Deny","Principal":"*","Action":"s3:*",
 "Resource":["arn:aws:s3:::lake-bucket","arn:aws:s3:::lake-bucket/*"],
 "Condition":{"StringNotEquals":{"aws:SourceVpce":"vpce-0abc123"}}}`, true, "Denies everything that does not arrive through that endpoint."),
      O(`{"Effect":"Allow","Principal":"*","Action":"s3:*",
 "Resource":["arn:aws:s3:::lake-bucket","arn:aws:s3:::lake-bucket/*"],
 "Condition":{"IpAddress":{"aws:SourceIp":"10.0.0.0/16"}}}`, false, "Requests through a gateway endpoint do not carry the VPC's private addresses, and an Allow does not block other paths."),
    ],
    r: "Restrict S3 to a VPC endpoint: Deny with StringNotEquals aws:SourceVpce. Private IPs do not appear via gateway endpoints."
  },
  {
    id: "syn-scp-region-deny", d: 4, t: "Syntax", oc: true,
    q: "A security team wants to stop every account in the organization, administrators included, from using any Region other than eu-central-1 and eu-west-1. Global services such as IAM must keep working. Which SCP statement is correct?",
    o: [
      O(`{"Effect":"Allow","Action":"*","Resource":"*",
 "Condition":{"StringEquals":{"aws:RequestedRegion":
   ["eu-central-1","eu-west-1"]}}}`, false, "An Allow never removes permissions, and FullAWSAccess stays attached."),
      O(`{"Effect":"Deny","NotAction":["iam:*","organizations:*","route53:*","support:*"],
 "Resource":"*",
 "Condition":{"StringEquals":{"aws:RequestedRegion":
   ["eu-central-1","eu-west-1"]}}}`, false, "StringEquals denies the two allowed Regions instead."),
      O(`{"Effect":"Deny","Action":"*","Resource":"*",
 "Condition":{"StringNotEquals":{"aws:RequestedRegion":
   ["eu-central-1","eu-west-1"]}}}`, false, "Also blocks global services, which are called through other Regions' endpoints."),
      O(`{"Effect":"Deny","NotAction":["iam:*","organizations:*","route53:*","support:*"],
 "Resource":"*",
 "Condition":{"StringNotEquals":{"aws:RequestedRegion":
   ["eu-central-1","eu-west-1"]}}}`, true, "Denies everything outside the two Regions except the listed global services."),
    ],
    r: "Region guardrail: SCP Deny with NotAction (global services) and StringNotEquals on aws:RequestedRegion."
  },
  {
    id: "glue-detect-sensitive-data", d: 4, t: "Glue",
    q: "A Glue Studio ETL job loads customer files into a curated zone. During the load, columns holding credit card and national ID numbers must be detected and hashed before the data is written, with the least extra tooling. Which solution meets this?",
    o: [
      O("The Detect Sensitive Data transform in the Glue job, hashing detected entities.", true, "Detection and hashing happen inside the job that already loads the data."),
      O("A Macie scan of the landing bucket, with a Lambda function masking the files.", false, "Macie reports which objects contain sensitive data. It does not transform them, so you add more glue."),
      O("Each file opened in a DataBrew project and masked by hand.", false, "Manual for every file."),
      O("A Lambda function with regular expressions for each file.", false, "Custom code to build and maintain."),
    ],
    r: "Detect and mask PII during Glue ETL: Detect Sensitive Data transform. Macie discovers sensitive data in S3 but does not mask it."
  },
  {
    id: "databrew-deterministic-pii", d: 4, t: "Glue",
    q: "Analysts without coding skills must share a customer dataset with a partner. Email addresses must be unreadable, but the partner must still be able to join the data with its own records keyed on the same protected email value. Which solution has the LEAST development effort?",
    o: [
      O("A DataBrew recipe masking the email with asterisks before sharing.", false, "Masked values are not unique, so they cannot be used as a join key."),
      O("A DataBrew recipe applying deterministic encryption or hashing to the email.", true, "The same email always yields the same protected value, so joins still work and the original is unreadable."),
      O("A DataBrew recipe deleting the email column before sharing.", false, "Removes the join key."),
      O("A DataBrew recipe applying probabilistic encryption to the email.", false, "The same input gives different output each time, so values cannot be joined."),
    ],
    r: "Protect PII but keep it joinable: deterministic encryption or hashing. Masking and probabilistic encryption break joins."
  },
  {
    id: "redshift-dynamic-masking", d: 4, t: "Redshift",
    q: "In Redshift, support agents must see only the last four digits of a card number while the finance team sees the full value. Both groups query the same table. The company wants the least maintenance. Which solution meets this?",
    o: [
      O("A view per group, each exposing a different expression for the column.", false, "Works, but views to maintain, and users must query the right one."),
      O("A column-level GRANT on the card column for the support role.", false, "Hides or shows the whole column. It cannot show part of it."),
      O("A dynamic data masking policy attached to the column for the support role.", true, "Redshift applies the mask at query time per role, on the same table."),
      O("The card number encrypted in the application with KMS.", false, "Everyone who lacks the key sees ciphertext, and the application has to manage it."),
    ],
    r: "Same table, different visibility of the same column: Redshift dynamic data masking policies attached to roles."
  },
  {
    id: "redshift-row-level-security", d: 4, t: "Redshift",
    q: "Regional managers query a shared Redshift table directly. Each manager should see only the rows for their region, and the rule must apply to every query automatically. Which feature fits best?",
    o: [
      O("One view per region for the managers, each with a WHERE clause.", false, "Works, but more objects to maintain."),
      O("Column-level grants for the managers' role on the shared table.", false, "Restrict columns, not rows."),
      O("A Lake Formation data filter on the Redshift table for each manager.", false, "Lake Formation filters govern data lake tables, not native Redshift tables."),
      O("A row-level security policy on the table, attached to the managers' role.", true, "Redshift adds the policy predicate to every query from those users."),
    ],
    r: "Rows per user in native Redshift tables: row-level security policies. Columns: column grants. Partial values: masking."
  },
  {
    id: "quicksight-rls-dataset", d: 4, t: "QuickSight",
    q: "A QuickSight dashboard on a SPICE dataset is shared with 300 users. Each user must see only rows for their own country. The team wants the least maintenance as users are added. Which solution meets this?",
    o: [
      O("Row-level security on the dataset, using a permissions dataset that maps users to countries.", true, "One dashboard, with rows filtered per viewer from the mapping table."),
      O("One dashboard built per country and shared with that country's group.", false, "Many dashboards to keep in sync."),
      O("Lake Formation row filters applied to the source of the SPICE dataset.", false, "SPICE holds an imported copy, so source-side filters do not apply at view time."),
      O("One dataset per country, each shared with a country group.", false, "Many datasets and refreshes."),
    ],
    r: "Per-user rows in QuickSight: row-level security with a rules (permissions) dataset."
  },
  {
    id: "cloudtrail-integrity-lock", d: 4, t: "Monitoring",
    q: "An auditor requires proof that the organization's API activity logs have not been altered since they were written, and that administrators of workload accounts cannot delete them. The company wants managed services and little custom work. Which solution meets this?",
    o: [
      O("S3 server access logs on the application buckets in each account.", false, "Those record bucket requests, not account API activity."),
      O("An organization trail with log file validation, delivered to a locked bucket in a security account.", true, "Digest files prove integrity, and a locked bucket in another account keeps logs out of reach."),
      O("AWS Config aggregated rules and configuration history across the accounts.", false, "Config tracks resource configuration, not the API activity logs."),
      O("CloudWatch Logs with one-year retention in each account.", false, "Workload administrators can still delete the log groups, and there is no tamper evidence."),
    ],
    r: "Tamper-evident audit logs: CloudTrail log file integrity validation plus a locked bucket in a separate account."
  },
  {
    id: "redshift-audit-user-activity", d: 4, t: "Redshift",
    q: "A compliance team needs a record of every SQL statement run by each database user on a Redshift cluster, kept for a year at low cost. Which solution meets this with the LEAST effort?",
    o: [
      O("AWS Config recording the cluster's configuration changes over the year.", false, "Tracks resource configuration, not SQL activity."),
      O("A scheduled query on STL_QUERY, keeping the results.", false, "System tables keep only a few days, and the export is custom work."),
      O("Audit logging to S3 with the user activity logging parameter turned on.", true, "The user activity log captures each statement and the logs sit cheaply in S3."),
      O("CloudTrail data events enabled for the cluster.", false, "CloudTrail records API calls, not SQL statements."),
    ],
    r: "Who ran which SQL in Redshift: audit logging (connection, user, user activity logs) to S3 or CloudWatch Logs."
  },
  {
    id: "config-auto-remediation", d: 4, t: "Monitoring",
    q: "The security team wants public S3 buckets detected across all accounts and fixed automatically within minutes, with the least custom code. Which solution meets this?",
    o: [
      O("IAM Access Analyzer findings sent to the security team by SNS.", false, "Detects, but nothing is fixed automatically."),
      O("A CloudTrail event, an EventBridge rule and a Lambda function blocking public access.", false, "Works, but you write and maintain the function."),
      O("A Macie scan of the buckets, with findings emailed through SNS.", false, "Macie looks for sensitive data and does not fix bucket exposure."),
      O("A Config managed rule for public buckets with automatic remediation, aggregated across accounts.", true, "Config detects the non-compliance and runs a remediation (Systems Manager Automation) without custom code."),
    ],
    r: "Detect and auto-fix a non-compliant configuration: AWS Config rule with automatic remediation."
  },
  {
    id: "iam-passrole-glue", d: 4, t: "IAM",
    q: "A CI role can create Glue jobs, but deployments fail with AccessDenied on iam:PassRole when the pipeline assigns the job's execution role GlueEtlRole. The team follows least privilege. What should the data engineer do?",
    o: [
      O("iam:PassRole on the GlueEtlRole ARN for the CI role, limited to glue.amazonaws.com.", true, "Narrow permission to hand exactly that role to exactly that service."),
      O("The CI role added to the trust policy of GlueEtlRole.", false, "The trust policy decides who may assume the role (Glue), not who may pass it."),
      O("AdministratorAccess attached to the CI role for the pipeline.", false, "Fixes it, and breaks least privilege."),
      O("glue:* allowed on all resources for the CI role.", false, "That does not grant iam:PassRole."),
    ],
    r: "Giving a service a role needs iam:PassRole on that role (scoped with iam:PassedToService). The trust policy is a separate thing."
  },
  {
    id: "iam-abac-prefix", d: 4, t: "IAM",
    q: "A data lake bucket has one prefix per team, and new teams join every month. Engineers from each team should access only their own team's prefix, without anyone editing IAM policies each time a team is added. Which solution has the LEAST operational overhead?",
    o: [
      O("One IAM policy per team, attached to that team's group.", false, "A new policy for each new team."),
      O("Users tagged with their team and one policy using aws:PrincipalTag/team in the S3 prefix.", true, "Attribute-based access control: one policy, and new teams only need tagged users and a prefix."),
      O("A bucket policy statement added for each new team.", false, "Grows toward the bucket policy size limit and needs edits for each team."),
      O("A single role shared by all engineers, with prefixes by convention.", false, "No separation between teams."),
    ],
    r: "Scale permissions without policy edits: ABAC with principal tags (aws:PrincipalTag) in one policy."
  },
  {
    id: "s3-access-points", d: 4, t: "S3",
    q: "Eighty teams share one large S3 bucket. Each team needs its own access rules, and some must be restricted to the company VPC. Writing every rule into the single bucket policy has hit the policy size limit. Which solution has the LEAST operational overhead?",
    o: [
      O("All the rules moved into IAM identity policies for each team.", false, "Identity policies grow just as large, and the bucket policy must still delegate."),
      O("The data served to each team through CloudFront signed URLs.", false, "A content delivery tool, not a way to manage team permissions."),
      O("One S3 access point per team, each with its own policy and optional VPC restriction.", true, "Each access point carries its own policy, so the bucket policy stays small."),
      O("The data split into 80 buckets, one per team.", false, "Works, but means moving data and managing 80 buckets."),
    ],
    r: "Many teams on one bucket with separate policies: S3 Access Points (one policy each, VPC-restrictable)."
  },
  {
    id: "athena-workgroup-enforce-kms", d: 4, t: "Athena",
    q: "Analysts query sensitive data in Athena. Query results must always be encrypted with a company KMS key and written to a controlled bucket, and analysts must not be able to override those settings in their clients. Which solution meets this?",
    o: [
      O("A separate AWS account for each analyst.", false, "Heavy structure for a settings problem."),
      O("Analysts asked to set the result location and encryption in their clients.", false, "Relies on everyone doing it right."),
      O("Default encryption turned on for the results bucket only.", false, "Does not control which bucket analysts write to or which key is used."),
      O("A workgroup with SSE-KMS results, a fixed location and enforced settings, limited by IAM.", true, "The workgroup settings are enforced for every query run in it."),
    ],
    r: "Force Athena result location and encryption: workgroup with enforced settings (override client-side settings)."
  },
  {
    id: "client-side-encryption-kms", d: 4, t: "KMS",
    q: "A regulated company must make sure AWS never sees its data in plaintext. Files are encrypted on premises before upload to S3, and only the company can decrypt them. The company wants key management in KMS. Which approach meets this?",
    o: [
      O("Client-side envelope encryption with KMS data keys before upload.", true, "Data is encrypted before it leaves the premises and only ciphertext reaches S3."),
      O("SSE-C, with the company's own key sent with each request.", false, "S3 still receives the plaintext and the key to do the encryption."),
      O("SSE-S3 with default encryption turned on for the bucket.", false, "AWS handles both the data and the keys."),
      O("SSE-KMS on the bucket with a customer managed key.", false, "S3 receives the plaintext and encrypts it."),
    ],
    r: "AWS must never see plaintext: client-side encryption (KMS data keys). Every SSE variant encrypts after S3 receives the data."
  },
  {
    id: "waf-rate-based-api", d: 4, t: "Security",
    q: "A public API Gateway endpoint ingests partner events. A few IP addresses occasionally flood it with requests and degrade it for others. Usage plans per API key do not help because the abusers share valid keys. The team wants the least operational overhead. Which solution meets this?",
    o: [
      O("Higher API Gateway throttling limits on the stage.", false, "Lets the flood through at a higher rate."),
      O("AWS WAF on the API stage with a rate-based rule per IP address.", true, "Blocks IPs that exceed a request rate, with no code."),
      O("Shield Advanced subscribed with no other changes.", false, "Aimed at larger DDoS events, with no per-IP request cap rules by default."),
      O("A Lambda authorizer counting requests per IP in DynamoDB.", false, "Works, but custom code and state to maintain."),
    ],
    r: "Per-IP request flooding on API Gateway: AWS WAF rate-based rule. Usage plans throttle per API key."
  },

  // ======================= EXTRA: multi-select and a few more D2 =======================
  {
    id: "multi-kinesis-spikes-backoff", d: 1, t: "Kinesis",
    q: "A fleet of devices writes to a provisioned Kinesis stream. Partition keys are well distributed, but unpredictable bursts push the stream past its write limits for short periods, and producers log ProvisionedThroughputExceeded. Data loss is unacceptable, and the team does not want to manage shard counts. Which TWO actions should the data engineer take?",
    o: [
      O("Producer retries with exponential backoff for failed PutRecords entries.", true, "Throttled records are re-sent, so brief bursts do not lose data."),
      O("Enhanced fan-out registered for the consumers.", false, "Affects the read side. The errors are on the write side."),
      O("The retention period raised to 7 days.", false, "Retention does not raise write throughput."),
      O("On-demand capacity mode for the stream.", true, "Capacity follows the traffic, with no shard management."),
      O("Reserved concurrency set on the consumer Lambda function.", false, "A consumer setting that does not affect producer throttling."),
    ],
    r: "Write throttling from bursts: on-demand mode (or more shards) plus producer retries with backoff. Fan-out and retention are read side."
  },
  {
    id: "multi-glue-executor-oom", d: 3, t: "Glue",
    q: "A Glue Spark job joins a 600 GB fact dataset with a 40 GB dimension and fails with executor out-of-memory errors in the join stage. The cluster is G.1X with auto scaling off. The team wants the job to finish reliably without rewriting the business logic. Which TWO actions are the most appropriate?",
    o: [
      O("Job bookmarks enabled on the job for the join stage.", false, "Tracks processed input. It does not change memory use."),
      O("G.2X workers for more memory per executor.", true, "Doubles memory and cores per worker, which gives each task more room."),
      O("A longer job timeout on the job and more retries.", false, "The job fails on memory, not time."),
      O("The job converted to a Python shell job on one node.", false, "A single node with no Spark, which makes it worse."),
      O("The large dataset repartitioned on the join key into smaller, even tasks.", true, "Smaller, balanced partitions need less memory per task."),
    ],
    r: "Spark executor OOM: bigger workers (G.2X or larger) and smaller or better balanced partitions. Timeouts and bookmarks do not help."
  },
  {
    id: "multi-cross-account-s3-kms", d: 4, t: "KMS",
    q: "A Glue job in account B must read objects from a bucket in account A. The objects are encrypted with a customer managed KMS key in account A. The job's IAM role in account B has S3 and KMS permissions in its identity policy, yet reads fail with access denied. Which TWO changes in account A are required?",
    o: [
      O("Macie enabled on the bucket to classify the objects.", false, "Macie classifies data and does not grant access."),
      O("An SCP in account A that allows the account B role.", false, "SCPs only limit permissions. They never grant them to another account's role."),
      O("A bucket policy statement allowing the account B role to read the objects.", true, "Cross-account S3 access needs permission on the resource side as well."),
      O("A Glue Data Catalog resource policy for account B on the database.", false, "Controls catalog access, not S3 objects or the key."),
      O("A key policy statement allowing the account B role kms:Decrypt.", true, "A customer managed key must allow the other account's principal."),
    ],
    r: "Cross-account S3 + SSE-KMS: both sides must allow. Bucket policy for the object read, key policy for kms:Decrypt (plus the caller's own IAM policy)."
  },
  {
    id: "multi-s3-versioned-cost", d: 2, t: "S3",
    q: "A versioned log bucket has grown expensive. Applications overwrite objects daily, and uploads of large files are often interrupted and never retried. Only the current version matters, with a seven-day rollback window. Which TWO lifecycle configurations reduce cost the MOST?",
    o: [
      O("The bucket replicated to a second Region for safety.", false, "Doubles storage instead of reducing it."),
      O("Aborting incomplete multipart uploads after a few days.", true, "Leftover parts from failed uploads cost storage until they are aborted."),
      O("Transfer Acceleration enabled on the bucket for the uploads.", false, "Speeds up uploads and adds cost."),
      O("Expiring noncurrent versions seven days after they become noncurrent.", true, "Removes the old versions that pile up but keeps the rollback window."),
      O("Requester Pays enabled on the bucket for the readers.", false, "Shifts who pays for requests and does not reduce stored data."),
    ],
    r: "Versioned bucket cost: expire noncurrent versions and abort incomplete multipart uploads (both lifecycle rules)."
  },
  {
    id: "multi-athena-many-partitions", d: 3, t: "Athena",
    q: "An Athena table partitioned by day has accumulated eight years of partitions in the Glue Data Catalog. Queries that filter on a date range now spend a long time just retrieving partition metadata, and a crawler run adds partitions every night. Which TWO actions improve this the MOST?",
    o: [
      O("Partition projection on the date column.", true, "Athena computes partitions from a pattern and skips catalog lookups entirely."),
      O("The crawler run every hour.", false, "More catalog updates, not faster lookups."),
      O("A higher workgroup data scanned limit.", false, "A guardrail that has nothing to do with metadata lookups."),
      O("MSCK REPAIR TABLE before every query.", false, "Adds registration work and makes metadata retrieval slower."),
      O("A partition index on the date partition keys.", true, "The catalog can then filter partitions on the server side."),
    ],
    r: "Slow partition lookups on huge tables: partition projection (Athena) or Glue partition indexes."
  },
  {
    id: "multi-lambda-duplicates-failures", d: 1, t: "Lambda",
    q: "A Lambda function is invoked asynchronously by S3 events and writes a summary row for each new file to a database. Occasionally the function is retried after a timeout and writes the same row twice, and a few events fail all retries and disappear without a trace. Which TWO changes fix both problems with the least effort?",
    o: [
      O("Function memory raised to 10 GB to shorten the run time.", false, "May speed it up, but does not address duplicates or lost events."),
      O("Reserved concurrency of 1 on the function to avoid overlap.", false, "Does not stop retries, and hurts throughput."),
      O("Provisioned concurrency turned on to avoid cold starts.", false, "Reduces cold starts only."),
      O("An idempotent database write, for example a unique key on object and version.", true, "A retried invocation then has no extra effect."),
      O("An on-failure destination or dead-letter queue on the function.", true, "Events that exhaust their retries are kept for review."),
    ],
    r: "Async Lambda retries: make the work idempotent and give failed events somewhere to go (DLQ or on-failure destination)."
  },
  {
    id: "multi-redshift-vpc-routing", d: 4, t: "Redshift",
    q: "A Redshift cluster in a private VPC runs COPY and UNLOAD against S3. A security review requires that this traffic never traverse the public internet and that it stays inside the company's VPC controls. Which TWO actions meet this requirement?",
    o: [
      O("Turn on enhanced VPC routing for the cluster.", true, "Forces COPY and UNLOAD traffic through the VPC, where the endpoint and policies apply."),
      O("Add a NAT gateway for outbound traffic.", false, "Reaches S3 through the public endpoint path instead of privately."),
      O("Attach a public IP address to the cluster.", false, "Makes the cluster reachable from the internet."),
      O("Open the cluster's security group to all outbound ports.", false, "Does not change the traffic path."),
      O("Create an S3 gateway VPC endpoint and route to it.", true, "Keeps the S3 traffic on the AWS network."),
    ],
    r: "Keep Redshift COPY/UNLOAD private: enhanced VPC routing plus an S3 gateway VPC endpoint."
  },
  {
    id: "multi-ddb-read-cost", d: 2, t: "DynamoDB",
    q: "A provisioned DynamoDB table is read mostly by single-item lookups on a small set of popular items. Read capacity is the largest part of the bill, and the application can tolerate data that is up to five minutes old. Which TWO changes reduce read cost the MOST?",
    o: [
      O("Put DAX in front of the table.", true, "Repeated reads are answered from the cache without consuming table capacity."),
      O("Replace the lookups with Scan operations.", false, "Reads and charges for far more data."),
      O("Use eventually consistent reads for these lookups.", true, "Costs half the read capacity of strongly consistent reads."),
      O("Switch to strongly consistent reads.", false, "Costs twice as much per read as eventually consistent."),
      O("Add a global secondary index on the item key.", false, "Adds storage and write cost without reducing base-table reads."),
    ],
    r: "Cut DynamoDB read cost: eventually consistent reads (half price) and DAX for repeated hot-item reads."
  },
  {
    id: "s3-intelligent-tiering-unknown", d: 2, t: "S3",
    q: "A raw data zone holds hundreds of terabytes. Some datasets are read daily for weeks, then go quiet, then are read again unpredictably for audits. The team cannot predict which datasets will be needed, wants objects readable immediately at any time, and wants the lowest cost with no lifecycle tuning. Which solution is the MOST cost-effective?",
    o: [
      O("S3 One Zone-IA for everything.", false, "Single Availability Zone, which is risky for raw data that may not be recreatable."),
      O("S3 Standard-IA for everything.", false, "Lower storage price, but retrieval fees hurt the datasets that are read often."),
      O("S3 Intelligent-Tiering.", true, "Moves objects between access tiers automatically, with no retrieval fees for the frequent and infrequent tiers."),
      O("A lifecycle rule moving all objects to Glacier Flexible Retrieval after 30 days.", false, "Retrieval takes minutes to hours, not immediate."),
    ],
    r: "Unknown or changing access pattern, instant reads, no tuning: S3 Intelligent-Tiering. Known pattern: lifecycle rules."
  },
  {
    id: "ddb-on-demand-spiky", d: 2, t: "DynamoDB",
    q: "A new promotions service stores campaign events in DynamoDB. Traffic is close to zero most of the day, then jumps sharply within seconds when a campaign email goes out, at times nobody can predict. The team does not want throttling during spikes or capacity planning. Which solution is the best fit?",
    o: [
      O("Provisioned capacity with auto scaling set to a high maximum.", false, "Auto scaling reacts after traffic rises, so a sudden jump can still throttle."),
      O("Provisioned capacity with reserved capacity purchased.", false, "Cheapest for steady load, not for spikes at unknown times."),
      O("Provisioned capacity set permanently to the expected peak.", false, "Avoids throttling but pays for peak capacity around the clock."),
      O("On-demand capacity mode.", true, "Absorbs sudden spikes and bills per request, with nothing to plan."),
    ],
    r: "Unpredictable, spiky DynamoDB traffic: on-demand mode. Steady and predictable: provisioned (plus reserved capacity)."
  },
  {
    id: "redshift-serverless-intermittent", d: 2, t: "Redshift",
    q: "A finance team runs heavy Redshift queries for about two hours on most weekdays, with occasional bursts of ad hoc analysis at other times. Nobody wants to manage nodes, resizes or pause schedules. Which solution is the MOST cost-effective with the LEAST operational overhead?",
    o: [
      O("Amazon Redshift Serverless.", true, "Capacity scales automatically and you pay for usage, so idle time costs little."),
      O("A provisioned RA3 cluster paused and resumed by scheduled Lambda functions.", false, "Saves money, but you maintain the schedules, and ad hoc bursts outside them are awkward."),
      O("A provisioned RA3 cluster running continuously with reserved nodes.", false, "Cheapest for steady 24/7 load, but wasteful here."),
      O("A provisioned cluster with concurrency scaling enabled.", false, "Adds burst capacity to a cluster you still pay for all day."),
    ],
    r: "Intermittent or unpredictable Redshift use with no capacity management: Redshift Serverless."
  },
];

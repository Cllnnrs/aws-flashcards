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
    q: "A company's auditors ask for proof that every S3 bucket in the account had default encryption enabled over the past six months, and for a record of when any bucket's encryption setting changed. The company wants this to continue automatically in the future. Which solution meets these requirements with the LEAST operational overhead?",
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
  }
];

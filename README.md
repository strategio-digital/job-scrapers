# Jobs crawlers

Get structured jobs data from various job websites.
- https://www.startupjobs.cz
- https://www.jobs.cz

## Turn this

```typescript
await startupJobsHandler(['php'], 'php')
await startupJobsCrawler.run([{ 
    url: 'https://www.startupjobs.cz/nabidky/vyvoj/back-end/php', 
    label: 'home' 
}])
```

## Into this
<img src="https://jzapletal.s3.eu-west-1.amazonaws.com/github-readme/job-crawler/example-table.png" width="100%" alt="Example Table">
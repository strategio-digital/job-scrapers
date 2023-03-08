# Jobs scrapers

Get structured jobs data from various job websites.
- https://www.startupjobs.cz
- https://www.jobs.cz

## Turn this

```typescript
//await startupJobsCrawler(['php'], 'https://www.startupjobs.cz/nabidky/vyvoj/back-end/php')
await jobsCrawler(['label-name'], 'https://beta.www.jobs.cz/prace/php-vyvojar')
await sheets.storeData('sheet-name')
```

## Into this
<img src="https://jzapletal.s3.eu-west-1.amazonaws.com/github-readme/job-crawler/example-table.png" width="100%" alt="Example Table">

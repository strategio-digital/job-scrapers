# Jobs scrapers

Get structured jobs data from various job websites.
- https://www.startupjobs.cz
- https://www.jobs.cz

## Turn this

```typescript
const tags = ['php', 'nette', 'symfony', 'laravel', 'vue', 'react', 'node']

for (const tag of tags) {
    await startupJobsCrawler([tag], `https://www.startupjobs.cz/nabidky?superinput=${tag}`)
    await jobsCrawler([tag], `https://beta.www.jobs.cz/prace/?q[]=${tag}`)
}

// Store data in Google Sheets
await dataset.store('sheet-name')
```

## Into this
<img src="https://jzapletal.s3.eu-west-1.amazonaws.com/github-readme/job-crawler/example-table.png" width="100%" alt="Example Table">

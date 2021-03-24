# math-parser
This is realization of test task: Parsing mathematical expressions and evaluating the results. 

Service has 2 endpoints: 
- POST/data
- GET/result

POST /data endpoint

- Request: a set of mathematical expressions in JSON format

Example of HTTP request body:

```{"expressions":[
"(10 + 16) / 2" ,
"5*3*2",
"2+2 * 2",
"200 / (50*2)",
"(14-7) * (21/3)"
]}
```

- Response:

HTTP status 200 (if everything is ok)

HTTP status 400 (if input data is invalid)

GET /result endpoint

- Request: (no data)

- Response: HTTP status 200 and a set of evaluated results of mathematical expressions in JSON format. Example of HTTP response body:
```
{"results":[13,30,6,2,49]}
```
If no results are available, then return HTTP status 200 and empty result set:
	{"results":[]}


- Each expression can contain any integer numbers between 0 and 1000.
- Each expression can contain any of the following symbols:  ' ', '+', '-', '*', '/', '(', ')'.


Developed by Denis <tardisThome@gmail.com>

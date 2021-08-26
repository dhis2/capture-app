## Naming guideline 

### Why: We want to foster the contribution of open source projects. General tomb rule try to think if someone that would understand the logic by following the code. Consistency and homogeneity. Refactor early. If the naming is confusing form the PR is already a sign that you should refactor If feedback is receive.  

### Folders names 

1. Avoid duplicate names. Folders with identical names create a lot of confusion. Consider what is the difference between the folders and reflect it in the folder name. Consider using versioning if it is a refactor.  

### Files names

1. The pattern is `camelCase` or `PascalCase`. 
2. One of the pattens we currently use is `<componentName>.<functionality>.js`. For example:

```
EnrollmentPage
├── EnrollmentPage.actions.js 
├── EnrollmentPage.component.js 
├── EnrollmentPage.constants.js 
├── EnrollmentPage.container.js 
├── Enrollmentpage.epics.js 
└── EnrollmentPage.types.js 
```

### Variable names

1. The pattern is `camelCase`. The exceptions are global constants and acronyms (eg HTML, DOM, DHIS2 etc) which should be in `UPPERCASE`. 
2. Use concise, human-readable, semantic names. It shouldn't be necessary to add a comment for additional documentation to the variable. 
3. Avoid abbreviation if the length is smaller than 25 characters.  

### Function names

1. The pattern is `camelCase`  
2. Name each function as `<verb><Noun>`. Every function is an action, so the name should contain at least one verb as a prefix. This verb as prefix can be anything (e.g. get, fetch, push, apply, calculate, compute, post).  
3. Avoid duplicate names for exported functions. Functions with identical names create a lot of confusion. Consider what is the difference between the functions and reflect it in the function name. 
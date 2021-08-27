## Naming guideline 

#### Why: The purpose of this naming guideline is to help create a human-readable code base that is easier to mantain and understand.

### Folders name 

1. Avoid duplicate names. Folders with identical names create a lot of confusion. Consider what is the difference between the folders and reflect it in the folder name. Consider using versioning if it is a refactor.  

### Files name

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

### Variables name

1. The pattern is `camelCase`. The exceptions are:
    - global constants and acronyms pattern is `UPPERCASE`.
    - redux action type pattern is `NOUN_VERB` with the present tense. For example: TEMPLATE_ADD: 'TemplateAdd'.
2. Use concise, human-readable, semantic names. It shouldn't be necessary to add a comment for additional documentation to the variable. 
3. Avoid abbreviation if the length is smaller than 25 characters. 
4. Give meaningful names to variables inside functional methods (map, forEach, reduce, every, some, ...). For example: 
```
// not good
options.map(o => /* do something */)

// better
options.map(option => /* do something */)
```
5. Give meaningful names to variables when initialise new object instance. For example: 
```
// not good
new DataElement((o) => {
    o.id = 'something';
})

// better
new DataElement((element) => {
    element.id = 'something';
})
```

### Functions name

1. The pattern is `camelCase`  
2. For system functions use the pattern `<verb><Noun>`. Every function is an action, so the name should contain at least one verb as a prefix. This verb as prefix can be anything (e.g. get, fetch, push, apply, calculate, compute, post). 
3. For user interaction functions use the pattern `<on><Verb>`. For example: `onUpdateValue`, `onExitSearch`, `onClick` etc.
4. Avoid duplicate names for exported functions. Functions with identical names create a lot of confusion. Consider what is the difference between the functions and reflect it in the function name. 
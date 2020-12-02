# Steps framework
- a framework for building an online application form that is capable of
    - multi-page navigation including conditional routing and looping through sub-flows 
    - capturing and validating user data
    - managing content (externalisation and internationalisation)
- the framework provides a consistent approach of handling common tasks such as navigation and data validation

## Basic Structure
- a parent Step class defines the basic structure of a step (content, schema, template) – `Step.js`
- child step classes are organised in a directory structure, with each directory containing the files required to run the step
- a common runner is used by each step to run a set of actions when a step is triggered – `UIStepRunner.js`
- each action is implemented by a function on the parent Step class 
- steps_old can override the default behaviour by specifying their own implementation of the function
- other common behaviour is abstracted through intermediate ancestor classes -  `ValidationStep.js, AddressStep.js`

## Startup
- steps_old are initialised on application startup – `initSteps.js`
    - step directories are scanned for step files (index, schema, template and content)
    - these files are used to initialise step objects    
- routes initialised for each step based on step URL
    - this sets up each step to invoke either the GET or POST function on the runner

## Runtime
- when a step is invoked, either the GET or POST function of the runner is invoked, depending on which request method was used 
- the runner executes a set of actions, mainly calling out to functions within the parent Step class
- on completion of these actions:
    - if the request was a POST, and actions completed successfully, the runner redirects to the next step
    - if the request was a POST, but post-data failed validation, the runner renders the step template with errors
    - if the request was a GET, and actions completed successfully, the runner renders the step template, 
    - if an exception occurred, the runner renders an error page

## Creating a step
- create the step folder under 'steps_old/ui/<section>/'
- create the step json content file, with the same name as the foder above, under 'resources/en/translation/ui/section/'
- create the step template file, [template.html], a nunjucks file that defines the layout of the page
- if the step collects input data that needs to be validated, create a json schema file, [schema.json]
    - this file will contain input validation rules, such as whether fields are mandatory, min/max values...
- create the step class file, [index.js], which defines the step behaviour
    - the minimum requirement of the class is to define the step url, by implementing getUrl method
    - if the step requires custom behaviour that is different to what's defined in the parent step, it can defined here by overriding the relevant method
        - implement handleGet()/handlePost() to override behaviour when the step loads, or when it's submitted
        - implement validate() to override validation logic
        - implement action() to override post processing actions such as transient data cleanup 
        - implement generateContent() to override how step content is loaded
        - other methods that can be overriden isComplete(), next(), nextStepUrl(), getContextData(), generateFields(), isSoftStop(), ...



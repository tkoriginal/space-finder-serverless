# space-finder-serverless

### Folder Structure
- infrastructure (Contains CDK related code)
  - Launcher.ts (Logic for launching the project)
  - SpaceStack.ts (All the Resource related logic)
- services (Contains business logic - AWS Lambda)

# Anatomy of CDK


1. #### Infrastructure

	- All the resourcing and infrastructure code goes here
	- More importantly, we have
		1. Stack

			- A Stack is a root construct that represents a single cloud formation stack. Think of it like the stack of your app, like express, React, etc. But not really those but rather Lambdas, DynamoDB, etc. 

			- We extend the Stack class from the `aws-cdk-lib` and our constructor will have 3 params `scope` which is our App that we create in the `Launcher` an `id` and give is some props such as a `stackName` which is a string that we provide when we create an instance of this stack and it is identifiable on the AWS console. 

			- Resources

				- API Gateway

					- Gives us the ability to make a RestAPI, passing it the stack and an `id` 

					- Also provides us with a LambdaIntegration class which takes in a lambda and integrates it with the API Gateway

				- AWS Lambda

					- A serverless function that is called when we hit a route on the API Gateway

					- We create a new LandaFunction class, pass it the stack, an id and some function props. The function props include the node verison you want to use, code that you want to run, which can be a file, a docker image, a s3 bucket etc and a handler or a function from witing that file


		1. Launcher - Here we create our `App` that we get from the `aws-cdk-lib` which initializes a CDK application

			- `const app = new App()` 

			- Simply pass the app to the our created Stack as the scope or construct for the rest of the app. 

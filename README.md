# FlexNest
A flexible subscription service manager built on Stacks blockchain using Clarity.

## Features
- Create and manage subscription plans
- Subscribe/unsubscribe users to plans
- Track subscription periods and payments
- Pause/resume subscriptions with automatic end date adjustment
- View subscription history

## Contract Functions
- create-plan: Create a new subscription plan
- subscribe: Subscribe a user to a plan
- unsubscribe: Cancel a subscription
- pause-subscription: Temporarily pause a subscription
- resume-subscription: Resume a paused subscription, automatically extending end date by pause duration
- get-subscription-details: Get details of a subscription
- get-plan-details: Get details of a plan

## Pause/Resume Functionality
When a subscription is paused, the contract tracks the pause block height. Upon resuming, 
the subscription end date is automatically extended by the duration of the pause period,
ensuring users receive their full subscription period.

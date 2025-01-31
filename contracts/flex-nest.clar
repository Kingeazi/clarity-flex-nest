;; FlexNest Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-plan (err u101))
(define-constant err-already-subscribed (err u102))
(define-constant err-not-subscribed (err u103))
(define-constant err-already-paused (err u104))

;; Data Variables
(define-map subscription-plans
  { plan-id: uint }
  {
    name: (string-ascii 64),
    price: uint,
    duration: uint,
    active: bool
  }
)

(define-map subscriptions
  { subscriber: principal, plan-id: uint }
  {
    start-block: uint,
    end-block: uint,
    paused: bool,
    pause-block: uint
  }
)

;; Plan Management
(define-public (create-plan (plan-id uint) (name (string-ascii 64)) (price uint) (duration uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set subscription-plans
      { plan-id: plan-id }
      {
        name: name,
        price: price,
        duration: duration,
        active: true
      }
    ))
  )
)

;; Subscription Management
(define-public (subscribe (plan-id uint))
  (let (
    (plan (unwrap! (map-get? subscription-plans { plan-id: plan-id }) err-invalid-plan))
  )
    (asserts! (get active plan) err-invalid-plan)
    (ok (map-set subscriptions
      { subscriber: tx-sender, plan-id: plan-id }
      {
        start-block: block-height,
        end-block: (+ block-height (get duration plan)),
        paused: false,
        pause-block: u0
      }
    ))
  )
)

(define-public (pause-subscription (plan-id uint))
  (let (
    (sub (unwrap! (map-get? subscriptions { subscriber: tx-sender, plan-id: plan-id }) err-not-subscribed))
  )
    (asserts! (not (get paused sub)) err-already-paused)
    (ok (map-set subscriptions
      { subscriber: tx-sender, plan-id: plan-id }
      (merge sub { paused: true, pause-block: block-height })
    ))
  )
)

;; Read Only Functions
(define-read-only (get-plan-details (plan-id uint))
  (map-get? subscription-plans { plan-id: plan-id })
)

(define-read-only (get-subscription-details (subscriber principal) (plan-id uint))
  (map-get? subscriptions { subscriber: subscriber, plan-id: plan-id })
)

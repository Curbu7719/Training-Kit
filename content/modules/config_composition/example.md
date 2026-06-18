# Composing Behavior from Layered Configuration — Worked Example

## One application, three environments

A web service needs a request **timeout** and a **feature flag** for a new
checkout screen. Rather than hard-code these, we compose them from layers.

## The base layer (immutable defaults)

This ships with the application and never changes at runtime:

```
timeout_seconds: 30
new_checkout_enabled: false
log_level: "info"
```

## An environment override

Production needs a longer timeout and verbose logs. The override file lists
*only* what differs from the base:

```
# production overrides
timeout_seconds: 60
log_level: "debug"
```

`new_checkout_enabled` is absent here, so it keeps the base value of `false`.

## Runtime injection

On the day of launch, an operator turns the feature on by setting an environment
variable as the service starts — no code change, no new build:

```
NEW_CHECKOUT_ENABLED=true
```

## Resolving the final values

The system reads top-down, applying precedence (runtime beats override beats
base):

| Setting | Base | Override | Runtime | **Final** |
|----------------------|---------|----------|---------|-----------|
| timeout_seconds | 30 | 60 | — | **60** |
| new_checkout_enabled | false | — | true | **true** |
| log_level | info | debug | — | **debug** |

## What we gained

The exact same build runs in every environment. The launch happened by injecting
one value at runtime — the feature flipped on with no edit to source code and no
redeploy. Differences live in tiny override files, not scattered through the
program.

---
category: Components
type: Feedback
title: Popconfirm
---

A simple and compact confirmation dialog of an action.

## When To Use

A simple and compact dialog used for asking for user confirmation.

The difference with the `confirm` modal dialog is that it's more lightweight than the static popped full-screen confirm modal.

## API

| Param | Description | Type | Default value | Version Added |
| --- | --- | --- | --- | --- |
| cancelText | text of the Cancel button | string | `Cancel` | 3.0.0 |
| okText | text of the Confirm button | string | `Confirm` | 3.0.0 |
| okType | Button `type` of the Confirm button | string | `primary` | 3.0.0 |
| title | title of the confirmation box | string\|ReactNode | - | 3.0.0 |
| onCancel | callback of cancel | function(e) | - | 3.0.0 |
| onConfirm | callback of confirmation | function(e) | - | 3.0.0 |
| icon | customize icon of confirmation | ReactNode | &lt;Icon type="exclamation-circle" /&gt; | 3.8.0 |

Consult [Tooltip's documentation](https://ant.design/components/tooltip/#API) to find more APIs.

## Note

Please ensure that the child node of `Popconfirm` accepts `onMouseEnter`, `onMouseLeave`, `onFocus`, `onClick` events.

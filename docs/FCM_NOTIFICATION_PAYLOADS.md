# FCM Push Notification Payloads

This document describes the Firebase Cloud Messaging (FCM) v1 API notification payloads for the Navigator App.

## API Endpoint

```
POST https://fcm.googleapis.com/v1/projects/tribetaylingapps/messages:send
```

### Headers
```
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

> **Note**: The `ACCESS_TOKEN` must be a valid OAuth 2.0 access token generated using Google OAuth 2.0 with the scope `https://www.googleapis.com/auth/firebase.messaging`.

---

## Base Payload Structure (Cross-Platform)

All notifications should use this structure to work on both Android and iOS:

```json
{
  "message": {
    "token": "<DEVICE_FCM_TOKEN>",
    "notification": {
      "title": "Notification Title",
      "body": "Notification body text"
    },
    "data": {
      "id": "order_abc123",
      "type": "notification_type"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "default-channel-id",
        "sound": "default"
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "default",
          "badge": 1
        }
      }
    }
  }
}
```

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message.token` | string | Yes | The FCM device registration token |
| `notification.title` | string | Yes | Title displayed in the notification |
| `notification.body` | string | Yes | Body text displayed in the notification |
| `data.id` | string | Conditional | Must start with `order_` for order notifications |
| `data.type` | string | Yes | Notification type (see table below) |
| `data.channel` | string | Conditional | Required for chat notifications - chat channel UUID |
| `android.priority` | string | Yes | Always set to `"high"` |
| `android.notification.channel_id` | string | Yes | Always set to `"default-channel-id"` |
| `apns.headers.apns-priority` | string | Yes | Always set to `"10"` |

---

## Notification Types

| Type | Description | Required Data Fields |
|------|-------------|---------------------|
| `order_assigned` | New order assigned to driver | `id` (must start with `order_`) |
| `order_updated` | Order status updated | `id` (must start with `order_`) |
| `order_cancelled` | Order was cancelled | `id` (must start with `order_`) |
| `chat_message_received` | New chat message | `channel` (chat channel UUID) |

---

## Complete Payload Examples

### 1. Order Assigned

```json
{
  "message": {
    "token": "<DEVICE_FCM_TOKEN>",
    "notification": {
      "title": "New Order Assigned",
      "body": "You have been assigned order #12345. Tap to view details."
    },
    "data": {
      "id": "order_abc123xyz789",
      "type": "order_assigned"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "default-channel-id",
        "sound": "default"
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "default",
          "badge": 1
        }
      }
    }
  }
}
```

---

### 2. Order Updated

```json
{
  "message": {
    "token": "<DEVICE_FCM_TOKEN>",
    "notification": {
      "title": "Order Updated",
      "body": "Order #12345 status has been updated to 'In Transit'"
    },
    "data": {
      "id": "order_abc123xyz789",
      "type": "order_updated"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "default-channel-id",
        "sound": "default"
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "default"
        }
      }
    }
  }
}
```

---

### 3. Order Cancelled

```json
{
  "message": {
    "token": "<DEVICE_FCM_TOKEN>",
    "notification": {
      "title": "Order Cancelled",
      "body": "Order #12345 has been cancelled by the customer"
    },
    "data": {
      "id": "order_abc123xyz789",
      "type": "order_cancelled"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "default-channel-id",
        "sound": "default"
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "default"
        }
      }
    }
  }
}
```

---

### 4. Chat Message

```json
{
  "message": {
    "token": "<DEVICE_FCM_TOKEN>",
    "notification": {
      "title": "New Message",
      "body": "John: Hey, where is my order?"
    },
    "data": {
      "type": "chat_message_received",
      "channel": "chat_channel_uuid_here"
    },
    "android": {
      "priority": "high",
      "notification": {
        "channel_id": "default-channel-id",
        "sound": "default"
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "default",
          "badge": 1
        }
      }
    }
  }
}
```

---

## Testing with cURL

```bash
curl -X POST \
  'https://fcm.googleapis.com/v1/projects/tribetaylingapps/messages:send' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": {
      "token": "DEVICE_TOKEN_HERE",
      "notification": {
        "title": "Test Notification",
        "body": "This is a test push notification"
      },
      "data": {
        "id": "order_test123",
        "type": "order_assigned"
      },
      "android": {
        "priority": "high",
        "notification": {
          "channel_id": "default-channel-id",
          "sound": "default"
        }
      },
      "apns": {
        "headers": {
          "apns-priority": "10"
        },
        "payload": {
          "aps": {
            "sound": "default",
            "badge": 1
          }
        }
      }
    }
  }'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Notification not displaying | Ensure `channel_id` is `"default-channel-id"` and priority is `"high"` |
| Wrong screen opens on tap | Ensure `id` starts with `order_` for orders, or `channel` is set for chat |
| No sound | Check device sound settings and ensure `sound: "default"` is set |
| Token expired | Request a new FCM token from the device |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-27 | Initial documentation |

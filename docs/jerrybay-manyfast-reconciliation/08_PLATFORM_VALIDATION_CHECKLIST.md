# Platform Validation Checklist

This is a classification, not a claim that a live feature test passed. Every
unexecuted live test is explicitly marked `NOT VERIFIED`.

| Capability | Classification | Current evidence | Live test |
| --- | --- | --- | --- |
| Custom domain | Supported by hosting / owner configuration | Existing Vercel project `jerrybay-site` is listed | NOT VERIFIED |
| Owner edit | Workaround | Git source edit and review branch | NOT VERIFIED |
| External inquiry form | External | Tool not selected in SSOT Open Decisions | NOT VERIFIED |
| Local contact bridge | Workaround | Static external handoff can be implemented | NOT VERIFIED |
| Analytics | External | No approved provider or data inventory | NOT VERIFIED |
| SEO metadata | Workaround | Static HTML metadata and sitemap can be authored | NOT VERIFIED |
| Built-in SEO settings UI | Unknown | No live builder test | NOT VERIFIED |
| Versioning | Supported by repository | Git branch, commit, and baseline tag exist | NOT VERIFIED |
| Rollback | Supported by repository/hosting candidate history | Existing Vercel deployment history and Git tag observed | NOT VERIFIED |
| Dynamic story routes | Workaround | Static route files or later CMS decision | NOT VERIFIED |
| CMS / content database | Unknown | No approved platform or data contract | NOT VERIFIED |
| Payment / checkout | External and deferred | Commercial Gate is unresolved | NOT VERIFIED |
| Privacy policy generation | External / owner review | Controller, processor, retention, and transfer unknown | NOT VERIFIED |

## Validation Rule

Do not convert `Supported`, `External`, or `Workaround` into a public promise
until an owner-approved tool inventory and a real account test are attached.

# 模型与 Provider

本页讲解 LLM 模型与 provider 体系，对应 News 中的「统一迁移框架」「provider-compat 子模块」「Grok OAuth」「own GPT-5.6 provider」。

## 1. 模型引用：复合键

`feat(models)` 2026-04-20 起，模型引用全线切到 **`(provider, id)` 复合键**，取代单一模型名。
好处：同一模型名在不同 provider 下不冲突，切换 provider 不丢配置。

## 2. Provider 注册与发现

- `core/provider-registry.ts`：provider 注册表。
- `core/provider-catalog.ts`：provider 目录（可用供应商清单）。
- `core/model-manager.ts`：模型注册与发现（`getRegistryModelsForProvider`）。
- `core/model-sync.ts` / `model-known-enrichment.ts`：模型同步与已知模型增强（fallback、能力标注）。
- `shared/model-ref.ts`：统一的模型引用解析（`findModel`）。

## 3. Provider 兼容层（provider-compat）

`core/provider-compat/` 与各 provider 子模块处理**厂商差异**：

- **deepseek**：`extractReasoningFromContent` 提取器 + `ensureReasoningContentForToolCalls` 兜底（`fix #468`）；`apply` 主流程 `ensure` 兜底。
- **qwen**：`utility mode` 关 `enable_thinking`。
- `core/provider-compat.ts`：通用兼容逻辑；`provider-prompt-patches.ts`：prompt 补丁。
- `core/provider-media-config.ts` / `provider-media-serializer.ts`：多模态（媒体）配置与序列化。

## 4. 认证

- `core/provider-auth-migration.ts`：provider 凭证迁移（旧格式 → 新格式）。
- `server/routes/provider-credentials.ts` / `providers.ts`：凭证 REST 读写。
- `feat(providers): add Grok OAuth subscription login`：OAuth 订阅登录。
- `feat(models): own GPT-5.6 provider contracts`：自有 GPT-5.6 provider 契约。

## 5. LLM 客户端

- `core/llm-client.ts`：统一 LLM 调用入口（流式/非流式）。
- `core/llm-request-policy.ts` / `llm-utils.ts`：请求策略（重试、限流、格式归一）。
- `core/output-length-contract.ts`：输出长度契约。
- `lib/llm/`：prompt layout、预算等辅助。

## 6. 本地 Provider

- `core/local-provider-plugin-store.ts`：本地 provider 插件存储。
- `core/local-user-account.ts`：本地用户账户（离线可用）。

## 7. 面试要点

- "为什么用 `(provider,id)` 复合键？"——解耦模型与供应商，避免同名冲突，支持同模型多供应商回退。
- "怎么处理厂商 reasoning 内容差异？"——provider-compat 子模块做提取器 + 兜底，统一为规范字段。

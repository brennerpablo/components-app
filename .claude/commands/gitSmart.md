# /gitSmart

Stage all changes, generate a useful commit message, commit, and push.

## Protocol

Follow these steps exactly and in order.

### Step 1 — Gather context

Run the following commands in parallel to understand what changed:

```bash
git status
```

```bash
git diff --stat
```

```bash
git diff
```

```bash
git diff --cached
```

```bash
git log --oneline -5
```

### Step 2 — Analyze and draft commit message

Review all staged and unstaged changes. Draft a concise, descriptive commit message:

- Use a short summary line (max ~72 chars) that describes the **intent** of the changes (not just "update files")
- If changes span multiple concerns, use a multi-line message: summary line + blank line + bullet points
- Match the style of recent commits from `git log`
- Use lowercase, no period at end of summary line
- Examples of good summaries: `add pagination to carteira dashboard`, `fix date filter on liquidez report`, `update Select and DatePicker components`

### Step 3 — Stage, commit, and push

Run the following commands sequentially:

```bash
git add .
```

Then commit using a HEREDOC for the message:

```bash
git commit -m "$(cat <<'EOF'
<commit message here>
EOF
)"
```

Then push:

```bash
git push
```

### Step 4 — Confirm

Show the user the commit hash, message, and confirmation that the push succeeded.

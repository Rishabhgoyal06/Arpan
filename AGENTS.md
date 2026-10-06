<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Frontend architecture
- Use TanStack file-based leaf routes with route-specific metadata and shared view components; this keeps URLs shareable without duplicating presentation.
- Routes with child pages must be Outlet-only layouts with their main content in a sibling index leaf; otherwise detail and creation views cannot mount.
- Keep domain types and demo data separate from a React context holding session-only state; a future engineering team can replace mock state without rewriting views.
- Keep all ARPAN functionality frontend-only with explicit demo verification and payment labeling; no backend or production security claims are permitted.
- Define visual roles as semantic CSS tokens and use the shared Button component for controls; consistent styling remains independently themeable.

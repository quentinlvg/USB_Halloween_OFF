from pathlib import Path

ROOT = Path("recreated_project")

FILES = [
    "supabase/config.toml",
    "supabase/migrations/20261022000000_create_configuration_caisse.sql",
    "supabase/functions/_shared/common.ts",
    "supabase/functions/claim-admin/index.ts",
    "supabase/functions/get-config/index.ts",
    "supabase/functions/save-config/index.ts",
    "supabase/functions/set-admin-pin/index.ts",
    "supabase/functions/unlock-admin/index.ts",
    "supabase/functions/upload-image/index.ts",

    "apps/buvette_halloween/src/api/claimAdmin.ts",
    "apps/buvette_halloween/src/api/getConfig.ts",
    "apps/buvette_halloween/src/api/saveConfig.ts",
    "apps/buvette_halloween/src/api/setAdminPin.ts",
    "apps/buvette_halloween/src/api/unlockAdmin.ts",

    "apps/buvette_halloween/src/components/admin/BuvetteEditor.tsx",
    "apps/buvette_halloween/src/components/admin/CategoriesEditor.tsx",
    "apps/buvette_halloween/src/components/admin/ProductImage.tsx",
    "apps/buvette_halloween/src/components/admin/ProductsEditor.tsx",
    "apps/buvette_halloween/src/components/admin/ThemeEditor.tsx",

    "apps/buvette_halloween/src/components/Decorations.tsx",
    "apps/buvette_halloween/src/components/PaymentPanel.tsx",
    "apps/buvette_halloween/src/components/ProductButton.tsx",

    "apps/buvette_halloween/src/lib/config.ts",
    "apps/buvette_halloween/src/lib/ConfigContext.tsx",
    "apps/buvette_halloween/src/lib/supabase.ts",

    "apps/buvette_halloween/src/pages/AdminPage.tsx",
    "apps/buvette_halloween/src/pages/CashierPage.tsx",

    "apps/buvette_halloween/src/App.tsx",
    "apps/buvette_halloween/src/index.css",
    "apps/buvette_halloween/src/main.tsx",
    "apps/buvette_halloween/src/vite-env.d.ts",

    "apps/buvette_halloween/components.json",
    "apps/buvette_halloween/.env.example",
    "apps/buvette_halloween/index.html",
    "apps/buvette_halloween/OVERVIEW.md",
    "apps/buvette_halloween/package.json",
    "apps/buvette_halloween/postcss.config.js",
    "apps/buvette_halloween/tailwind.config.ts",
    "apps/buvette_halloween/tsconfig.app.json",
    "apps/buvette_halloween/tsconfig.json",
    "apps/buvette_halloween/vite.config.ts",

    "packages/components/hooks/use-mobile.tsx",
    "packages/components/hooks/use-toast.ts",

    "packages/components/lib/utils.ts",

    "packages/components/markdown/index.tsx",
    "packages/components/markdown/markdown.css",
    "packages/components/markdown/Markdown.samples.tsx",
    "packages/components/markdown/Markdown.tsx",

    "packages/components/markdown-editor/index.tsx",
    "packages/components/markdown-editor/MarkdownEditor.samples.tsx",
    "packages/components/markdown-editor/MarkdownEditor.tsx",
    "packages/components/markdown-editor/MarkdownEditorToolbar.tsx",

    "packages/components/theme-switcher/index.tsx",
    "packages/components/theme-switcher/shadows.css",
    "packages/components/theme-switcher/ThemeSwitcher.tsx",

    "packages/components/ui/accordion.tsx",
    "packages/components/ui/alert-dialog.tsx",
    "packages/components/ui/alert.tsx",
    "packages/components/ui/aspect-ratio.tsx",
    "packages/components/ui/avatar.tsx",
    "packages/components/ui/badge.tsx",
    "packages/components/ui/button.tsx",
    "packages/components/ui/calendar.tsx",
    "packages/components/ui/card.tsx",
    "packages/components/ui/checkbox.tsx",
    "packages/components/ui/collapsible.tsx",
    "packages/components/ui/command.tsx",
    "packages/components/ui/context-menu.tsx",
    "packages/components/ui/date-picker.tsx",
    "packages/components/ui/dialog.tsx",
    "packages/components/ui/dropdown-menu.tsx",
    "packages/components/ui/form.tsx",
    "packages/components/ui/hover-card.tsx",
    "packages/components/ui/input.tsx",
    "packages/components/ui/label.tsx",
    "packages/components/ui/menubar.tsx",
    "packages/components/ui/navigation-menu.tsx",
    "packages/components/ui/popover.tsx",
    "packages/components/ui/progress.tsx",
    "packages/components/ui/radio-group.tsx",
    "packages/components/ui/scroll-area.tsx",
    "packages/components/ui/select.tsx",
    "packages/components/ui/separator.tsx",
    "packages/components/ui/sheet.tsx",
    "packages/components/ui/sidebar.tsx",
    "packages/components/ui/skeleton.tsx",
    "packages/components/ui/slider.tsx",
    "packages/components/ui/sonner.tsx",
    "packages/components/ui/switch.tsx",
    "packages/components/ui/table.tsx",
    "packages/components/ui/tabs.tsx",
    "packages/components/ui/textarea.tsx",
    "packages/components/ui/toast.tsx",
    "packages/components/ui/toaster.tsx",
    "packages/components/ui/toggle.tsx",
    "packages/components/ui/tooltip.tsx",

    "packages/components/package.json",
    "packages/components/tsconfig.json",

    ".gitignore",
    "package.json",
]

for file_path in FILES:
    full_path = ROOT / file_path
    full_path.parent.mkdir(parents=True, exist_ok=True)

    if not full_path.exists():
        full_path.touch()

print(f'Arborescence créée dans : {ROOT.resolve()}')
print(f'{len(FILES)} fichiers créés')
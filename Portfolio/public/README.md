# Islem Rais Portfolio

Static portfolio site ready for GitHub Pages.

## Publish On GitHub Pages

1. Create a new GitHub repository.
2. Upload every file from this `public` folder to the repository root.
3. In GitHub, open `Settings > Pages`.
4. Set `Source` to `GitHub Actions`.
5. Push to the `main` branch. The included workflow deploys the site automatically.

Your site will be available at:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

## Notes

- `index.html` is the public portfolio page.
- `admin.html` is a browser-local content editor. It stores edits in local storage, so those changes are not permanent for visitors on GitHub Pages.
- To permanently change deployed content, edit `data.js` and upload it again.
- The contact form uses the Google Apps Script URL in `script.js`.
- If you prefer not to use GitHub Actions, delete `.github/workflows/pages.yml`, then use `Settings > Pages > Deploy from a branch > main > / (root)`.

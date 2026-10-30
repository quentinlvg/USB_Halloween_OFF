# Caisse du club de football

Calculatrice de caisse visuelle pour les soirées du club. Chaque serveur ouvre le lien sur son téléphone (sans compte), touche les boissons et snacks commandés, voit le total en grand, saisit la somme reçue et lit la monnaie à rendre. Rien n'est enregistré : « Nouveau client » efface tout.

L'application conserve la configuration de la buvette sur l'appareil pour fonctionner avec une connexion instable. Elle la synchronise avec Supabase lors des modifications. Les opérations de lecture et d'administration passent par des Supabase Edge Functions ; la clé `service_role` reste côté serveur. La table et les fonctions ne sont pas accessibles directement par l'application publique.

Pour configurer le projet, renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env.local`, lier le projet Supabase avec `supabase link --project-ref <ref>`, appliquer les migrations avec `supabase db push`, puis déployer les fonctions avec `supabase functions deploy`. Pour Vercel, définir également ces deux variables dans les environnements Preview et Production ; la configuration de build se trouve dans `vercel.json`.

Le premier appareil qui ouvre une base vide en devient administrateur. **Protège l'accès au site lors de son premier lancement** pour que ce soit bien ton appareil qui revendique l'administration. Il faut ensuite définir un code dans l'éditeur de la buvette pour pouvoir ouvrir l'administration depuis un autre téléphone. Les fonctions PIN limitent les tentatives et ne stockent que le hash du code.

# nantesjs-feedback

Outil de création de modèle openfeedback à partir de meetup

## Pré-requis 🧰

* Node >= 12.0.0

## Configuration :wrench:

* Copier le fichier `.env.sample` et nommez-le `.env`
* Renseignez les variables grâce à l'aide ci-dessous

### GitHub :octocat:

Vous devez créer un token avec le scope `gist` pour pouvoir utiliser l'API GitHub et créer un Gist.

https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line

La variable d'environnement `GITHUB_TOKEN` doit-être renseignée.

## Utilisation :sparkles:

```
node src/index.js chemin/vers/votre/fichier/meetup.md
```

### Exemple

```
node src/index.js meetup-sample.md
```

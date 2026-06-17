# Spotify Stats

Aplikacja webowa pozwalająca użytkownikom na logowanie się za pomocą konta Spotify i przeglądanie swoich spersonalizowanych statystyk muzycznych. Projekt zbudowany w oparciu o React, TypeScript oraz Vite.

## Funkcjonalności

* Autoryzacja użytkownika z wykorzystaniem Spotify OAuth.
* Wyświetlanie danych profilowych.
* Analiza i prezentacja najczęściej słuchanych artystów i utworów.
* Zestawienie ulubionych gatunków muzycznych.
* Podgląd ostatnio odtwarzanych utworów.

## Technologie

* React
* TypeScript
* Vite

## Wymagania wstępne

Aby uruchomić projekt lokalnie, będziesz potrzebować:
* Node.js zainstalowanego w systemie.
* Zarejestrowanej aplikacji w panelu [Spotify for Developers](https://developer.spotify.com/dashboard), aby uzyskać `Client ID`. W ustawieniach aplikacji Spotify jako `Redirect URI` podaj `http://localhost:5173/`.

## Uruchomienie lokalne

1. Sklonuj repozytorium:
   ```bash
   git clone <link_do_repozytorium>
   ```
2. Przejdź do folderu z projektem i zainstaluj zależności:
```bash
cd spotify-stats
npm install
```
3. Skonfiguruj zmienne środowiskowe:

Stwórz w głównym folderze projektu plik o nazwie .env

Skopiuj zawartość z pliku .env.example

Podmień wartość na swój klucz ze Spotify:
VITE_SPOTIFY_CLIENT_ID=twoj_klucz_tutaj

4. Uruchom serwer deweloperski:

```bash
npm run dev
```

4. Otwórz w przeglądarce adres podany w konsoli (domyślnie http://localhost:5173/).

FROM docker.repo.devalex.consulting/finanztreff/base-nginx:1.19.6-www
COPY dist/ /var/www/html/

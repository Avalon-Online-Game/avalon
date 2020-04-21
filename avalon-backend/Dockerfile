# pull official base image
FROM python:3.7-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev \
    && apk add --no-cache \
        libressl-dev \
        musl-dev \
        libffi-dev \
        jpeg-dev \
        zlib-dev \
        freetype-dev \
        lcms2-dev \
        openjpeg-dev \
        tiff-dev \
        tk-dev \
        tcl-dev \
        harfbuzz-dev \
        fribidi-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./avalon/requirements.txt /usr/src/app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# copy project
COPY . /usr/src/app/

# give permission to entrypoint
RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]
RUN dos2unix ./entrypoint.sh
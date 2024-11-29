{ nixpkgs_commit ? "751ce748bd1ebac94442dfeaa8bc3f100d73a9f6" }:

let
  pkgs = import 
    (builtins.fetchTarball "https://github.com/nixos/nixpkgs/tarball/${nixpkgs_commit}")
    { config = {}; overlays = []; };
    
  # Import unstable channel for nodejs_22
  unstable = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixpkgs-unstable.tar.gz") {};
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    postgresql
    unstable.nodejs_22
  ];

  shellHook = ''
    ######################################################################
    # Create a diretory for the generated artifacts                      #
    ######################################################################

    mkdir -p .nix-shell
    export NIX_SHELL_DIR=$PWD/.nix-shell

    ######################################################################
    # Put the PostgreSQL databases in the project diretory.              #
    ######################################################################

    export PGDATA=$NIX_SHELL_DIR/db
    export PGHOST=$PGDATA   # Set host to the data directory
    export PGDATABASE=TaskAppDb

    ######################################################################
    # Clean up after exiting the Nix shell using `trap`.                 #
    ######################################################################

    trap \
      "
        pg_ctl -D $PGDATA stop
        cd $PWD
        rm -rf $NIX_SHELL_DIR
      " \
      EXIT

    ######################################################################
    # Initialize database if it doesn't exist                            #
    ######################################################################

    if ! test -d $PGDATA
    then
      pg_ctl initdb -D $PGDATA
    fi

    ######################################################################
    # Configure PostgreSQL                                               #
    ######################################################################

    HOST_COMMON="host\s\+all\s\+all"
    sed -i "s|^$HOST_COMMON.*127.*$|host all all 0.0.0.0/0 trust|" $PGDATA/pg_hba.conf
    sed -i "s|^$HOST_COMMON.*::1.*$|host all all ::/0 trust|" $PGDATA/pg_hba.conf

    pg_ctl \
      -D $PGDATA \
      -l $PGDATA/postgres.log \
      -o "-c unix_socket_directories='$PGDATA'" \
      -o "-c listen_addresses='*'" \
      -o "-c log_destination='stderr'" \
      -o "-c logging_collector=on" \
      -o "-c log_directory='log'" \
      -o "-c log_filename='postgresql-%Y-%m-%d_%H%M%S.log'" \
      -o "-c log_min_messages=info" \
      -o "-c log_min_error_statement=info" \
      -o "-c log_connections=on" \
      start

    ######################################################################
    # Wait for PostgreSQL to be ready                                    #
    ######################################################################

    echo "Waiting for PostgreSQL to be ready..."
    while ! pg_isready -h $PGDATA; do
      sleep 1
    done
    echo "PostgreSQL is ready!"

    ######################################################################
    # Create and initialize database with mock data                      #
    ######################################################################

    # Create database if it doesn't exist
    createdb --host=$PGDATA $PGDATABASE || true

    # Check if initialization script exists
    if [ ! -f "init.sql" ]; then
      echo "Warning: init.sql not found. Database will be created without initial data."
    else
      echo "Initializing database from init.sql..."
      psql --host=$PGDATA -f init.sql
      echo "Database initialized with mock data!"
    fi

    echo "To connect to the database, run: psql --host=$PGDATA"
  '';

  LOCALE_ARCHIVE = if pkgs.stdenv.isLinux then "${pkgs.glibcLocales}/lib/locale/locale-archive" else "";
}

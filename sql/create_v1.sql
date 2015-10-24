CREATE TABLE owners(
       id SERIAL PRIMARY KEY,
       phone_num CHARACTER VARYING(12) NOT NULL,
       -- available characters for backtrack_id ABCDEFGHJKLMNPQRSTUVWXYZ23456789
       backtrack_id CHARACTER VARYING(4) NOT NULL, 
       items_lost INT NOT NULL DEFAULT 0
);

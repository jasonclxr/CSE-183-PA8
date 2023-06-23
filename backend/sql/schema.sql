-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
DROP TABLE IF EXISTS Replies;
DROP TABLE IF EXISTS Listings;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), name jsonb, email VARCHAR(64) UNIQUE, phone VARCHAR(32) UNIQUE, password VARCHAR(64));
CREATE TABLE Categories (category VARCHAR(128) PRIMARY KEY, filters jsonb, subcategories jsonb);
CREATE TABLE Listings (id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), userid UUID REFERENCES Users(id), category VARCHAR(128) REFERENCES Categories(category), creationDate DATE, price DECIMAL(16,2), title VARCHAR(64), text VARCHAR(1024), filters jsonb, images jsonb);
CREATE TABLE Replies (listingid UUID REFERENCES Listings(id), userid UUID REFERENCES Users(id), message VARCHAR(2000), messageDate DATE);
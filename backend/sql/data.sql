-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --
-- Users --
INSERT INTO Users(name, email, phone, password) VALUES ('{"first": "Artyom", "last": "Martirosyan"}', 'art@gmail.com', '123-456-7890', '$2b$12$rpdj4iFua9d/tclc5BYcq.5foTFxmO8CTaZcbdlI1sD7/p3Lj3YzG');
INSERT INTO Users(name, email, phone, password) VALUES ('{"first": "Robbie", "last": "Radzville"}', 'rob@gmail.com', '123-456-7891', '$2b$12$1zdU06lJEuX0mC.0PKBCoex36CSNIvjnLXbDKFaVygAikj.q2dTF.');

-- Categories --

-- ROOT
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace', '{"subcategories": ["Vehicles", "Real Estate"]}', '{ "filters": {} }');
-- Vechicle Categories
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Vehicles', '{"subcategories": ["Cars", "Trucks"]}', '{ "filters": { "Sort By": { "order": 0, "type": "oneOf", "default": "Recommended", "options": { "Recommended": "", "Price: Lowest First": "order by filters->''Price'' ASC", "Price: Highest First": "order by filters->''Price'' DESC", "Date listed: Newest First": "order by creationdate ASC", "Date listed: Oldest First": "order by creationdate DESC"}}, "Price": {"order": 2, "type": "minMax" , "min": "And price >= ", "max": " AND price <= "}}}');
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Vehicles/Cars', '{"subcategories": []}', '{ "filters": { "Sort By": { "order": 0, "type": "oneOf", "default": "Recommended", "options": { "Recommended": "", "Price: Lowest First": "order by filters->''Price'' ASC", "Price: Highest First": "order by filters->''Price'' DESC", "Date listed: Newest First": "order by creationdate ASC", "Date listed: Oldest First": "order by creationdate DESC"}}, "Body Style": { "order": 1, "type": "anyOf","default": "All","options": {"All": "1=1","Hatchback": "filters->>''Body Style'' = ''Hatchback''","Minivan": "filters->>''Body Style'' = ''Minivan''","Sedan": "filters->>''Body Style'' = ''Sedan''"}}, "Price": {"order": 2, "type": "minMax" , "min": "And price >= ", "max": " AND price <= "}}}');
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Vehicles/Trucks', '{"subcategories": []}', '{ "filters": { "Color": { "order": 1, "type": "anyOf", "default": "All", "options": { "All": "1=1", "Black": "filters->>''Color'' = ''Black''","White": "filters->>''Color'' = ''White''","Blue": "filters->>''Color'' = ''Blue''"} }, "Price": { "order": 2, "type": "minMax" , "min": " AND price >= ", "max": " AND price <= " }, "Year": { "order": 3, "type": "minMax" , "min": " AND filters->>''Year'' >= ", "max": " AND filters->>''Year'' <= "}}}');
-- Real Estate Categories
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Real Estate', '{"subcategories": ["Houses", "Apartments"]}', '{"filters": {"Buying Options": {"order": 0, "type": "anyOf", "default": "All", "options": {"All": "1=1", "Rent": "filters->>''Housing Type'' = ''Rent''", "Buy": "filters->>''Housing Type'' =  ''Buy''"}}}}');
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Real Estate/Houses', '{"subcategories": []}', '{"filters": {"Buying Options": {"order": 0, "type": "anyOf", "default": "All", "options": {"All": "1=1", "Rent": "filters->>''Housing Type'' = ''Rent''", "Buy": "filters->>''Housing Type'' =  ''Buy''"}}, "Beds": {"order": 1, "type": "minMax" , "min": " AND filters->''Beds'' >= ", "max": " AND filters->''Beds'' <= "}, "Baths": {"order": 2, "type": "minMax" , "min": " AND filters->''Baths'' >= ", "max": " AND filters->''Baths'' <= "}}}');
INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Real Estate/Apartments', '{"subcategories": []}', '{"filters": {"Beds": {"order": 1, "type": "minMax" , "min": " AND filters->''Beds'' >= ", "max": " AND filters->''Beds'' <= "}, "Baths": {"order": 2, "type": "minMax" , "min": " AND filters->''Baths'' >= ", "max": " AND filters->''Baths'' <= "}}}');
-- Listings --
-- Vehicles
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Vehicles/Trucks', current_date, 13500.00, '2019 Ford F-150', 'Used Ford F-150. 60,000 miles', '{"Color": "White", "Price": 13500.00, "Year": 2019}', '{"images": ["https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/2019-ford-f-150-limited-3p5l-crew-cab-1544727022.jpg?crop=0.745xw:0.914xh;0.0385xw,0.0576xh&resize=640:*", "https://blogmedia.dealerfire.com/wp-content/uploads/sites/275/2019/01/front-interior-of-a-2019-Ford-F-150_o.jpg", "https://www.gannett-cdn.com/presto/2018/07/26/PDTF/3c21cc9a-3d6e-4a4f-85a2-76ad6d8a65fc-2019-Ford-F-150-Limited-06.jpg"]}' FROM users WHERE phone='123-456-7890';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Vehicles/Trucks', current_date, 2000.00, '2002 Toyota Tacoma', 'Like new 2002 Toyota Tacoma, only 320,000 miles!', '{"Color": "Black", "Price": 2000.00, "Year": 2002}', '{"images": ["https://media.ed.edmunds-media.com/toyota/tacoma/2001/oem/2001_toyota_tacoma_extended-cab-pickup_s-runner-v6_fq_oem_1_500.jpg", "https://static.cargurus.com/images/site/2017/01/10/18/31/2002_toyota_tacoma_2_dr_std_4wd_standard_cab_lb-pic-3116352714742993568-1600x1200.jpeg", "https://glenshelly.com/assets/img/sales/2002-toyota-tacoma/13-car.jpg"]}' FROM users WHERE phone='123-456-7891';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Vehicles', current_date, 600.00, 'Go Kart', 'Be careful not to hit a banana', '{"Price": 600.00}', '{"images": ["https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6448/6448558_sd.jpg", "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6448/6448558_sd.jpg", "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6448/6448558_sd.jpg"]}' FROM users WHERE phone='123-456-7890';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Vehicles/Cars', current_date, 10000.00, '2015 Honda Odyssey', 'Time to take the kids to soccer', '{"Price": 10000.00, "Body Style": "Minivan"}', '{"images": ["https://agirlsguidetocars.com/wp-content/uploads/2015/06/2015-Honda-Odyssey.png", "https://cars.usnews.com/static/images/Auto/izmo/i4962/2015_honda_odyssey_dashboard.jpg", "https://i.pinimg.com/originals/c6/fd/4e/c6fd4e32c7d6f0932e69246f6fa4db26.jpg"]}' FROM users WHERE phone='123-456-7891';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Vehicles/Cars', current_date, 8000.00, '2013 Toyota Prius', 'This Prius will cut the cost of your commute in half!', '{"Price": 8000.00, "Body Style": "Sedan"}', '{"images": ["https://cars.usnews.com/static/images/Auto/izmo/354418/2013_toyota_prius_angularfront.jpg", "https://cars.usnews.com/static/images/Auto/izmo/354418/2013_toyota_prius_dashboard.jpg", "https://cars.usnews.com/static/images/Auto/izmo/354418/2013_toyota_prius_trunk.jpg"]}' FROM users WHERE phone='123-456-7891';
-- Real Estate
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Real Estate', current_date, 16000.00, 'A Big Pile of Dirt', 'Great location for a big pile of dirt!', '{"Housing Type": "Buy"}', '{"images": ["https://ak.picdn.net/shutterstock/videos/21017782/thumb/1.jpg", "https://i.pinimg.com/474x/5d/c4/aa/5dc4aa46d0a6d7cb811a76d5352e7fa1--pile-google-search.jpg", "https://thumbs.dreamstime.com/z/cheerful-young-man-shoveling-big-pile-dirt-looking-camera-isolated-white-background-53665245.jpg"]}' FROM users WHERE phone='123-456-7890';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Real Estate/Houses', current_date, 6000.00, 'Robbies house', 'Great house in Santa Cruz, CA', '{"Housing Type": "Rent", "Beds": 3, "Baths": 3.5}', '{"images": ["https://ssl.cdn-redfin.com/photo/8/mbphoto/973/genMid.ML81723973_6.jpg", "https://ssl.cdn-redfin.com/photo/8/mbphoto/973/genMid.ML81723973_1_6.jpg", "https://photos.zillowstatic.com/fp/e837d5b66a3c4a98eed5bcd9f5b14787-cc_ft_384.jpg"]}' FROM users WHERE phone='123-456-7891';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Real Estate/Houses', current_date, 7500000.00, 'Meder St Mansion', 'Cool mansion in Santa Cruz, CA', '{"Housing Type": "Buy", "Beds": 4, "Baths": 5}', '{"images": ["https://ap.rdcpix.com/8c4478fd7d6887b92cc4b2598c2a3047l-b1585766090od-w480_h360_x2.jpg", "https://www.compass.com/m2/b076064c85892e3a582dfdb03c2db4f777479c69_img_6/origin.jpg", "https://www.compass.com/m2/b076064c85892e3a582dfdb03c2db4f777479c69_img_11/origin.jpg"]}' FROM users WHERE phone='123-456-7890';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Real Estate/Apartments', current_date, 4500.00, 'Its an apartment yo', '1 room apartment in SF', '{"Housing Type": "Rent", "Beds": 1, "Baths": 1}', '{"images": ["https://s.hdnux.com/photos/01/14/05/14/19944234/3/1200x0.jpg", "https://s.hdnux.com/photos/01/14/05/14/19944234/3/1200x0.jpg", "https://s.hdnux.com/photos/01/14/05/14/19944234/3/1200x0.jpg"]}' FROM users WHERE phone='123-456-7890';
INSERT INTO listings (userid, category, creationDate, price, title, text, filters, images) SELECT id, 'Marketplace/Real Estate/Apartments', current_date, 2500.00, 'Hilltop Apartment', 'Great place to stay for students. Comes with nice amenities', '{"Housing Type": "Buy", "Beds": 2, "Baths": 2}', '{"images": ["https://images1.apartments.com/i2/QPGCkZRGhV4o4hEN0TCUiMpsytaD-5ytyjy-dR050FA/111/the-hilltop-santa-cruz-ca-primary-photo.jpg", "https://www.greystar.com/dfsmedia/ec6d229c550048739bb0d58403fec24c/118384-50035?mw=800&width=800&height=0", "https://www.greystar.com/dfsmedia/ec6d229c550048739bb0d58403fec24c/118376-50035?mw=800&width=800&height=0"]}' FROM users WHERE phone='123-456-7891';
-- Replies
INSERT INTO Replies (listingid, userid, message, messageDate) SELECT id, userid, 'Wow this is a cool thing that you are selling', DATE '2020-11-29T08:11:21.000Z' from Listings where price = 13500;
INSERT INTO Replies (listingid, userid, message, messageDate) SELECT id, userid, 'Nice truck!', current_date from Listings where price = 2000;


-- INSERT INTO categories (category, subcategories, filters) 
-- VALUES ('Marketplace/Vehicles', '{"subcategories": ["Trucks", "Cars"]}', 
--   '{ 
--     "filters": { 
--       "Sort By": { 
--         "order": 0, 
--         "type": "oneOf", 
--         "default": 
--         "Recommended", 
--         "options": { 
--           "Recommended": "", 
--           "Price: Lowest First": "order by filters->''Price'' ASC", 
--           "Price: Highest First": "order by filters->''Price'' DESC", 
--           "Date listed: Newest First": "order by creationdate ASC", 
--           "Date listed: Oldest First": "order by creationdate DESC" 
--         } 
--       }, 
--       "Body Style": { 
--         "order": 1, 
--         "type": "anyOf", 
--         "default": "All", 
--         "options": { 
--           "All": "", 
--           "Hatchback": "filters->>''Body Style'' = ''Hatchback''", 
--           "Minivan": "filters->>''Body Style'' = ''Minivan''", 
--           "Sedan": "filters->>''Body Style'' = ''Sedan''"
--         } 
--       }, 
--       "Price": { 
--         "order": 2, 
--         "type": "minMax" , 
--         "min": "And price >= ", 
--         "max": " AND price <= "
--       } 
--     } 
--   }'
-- );

-- INSERT INTO categories (category, subcategories, filters) VALUES ('Marketplace/Vehicles/Trucks', '{"subcategories": []}', 
--   '{ 
--     "filters": { 
--       "Color": { 
--         "order": 1, 
--         "type": "anyOf", 
--         "default": "All", 
--         "options": { 
--           "All": "", 
--           "Black": "filters->>''Color'' = ''Black''",
--           "White": "filters->>''Color'' = ''White''",
--           "Blue": "filters->>''Color'' = ''Blue''",
--         } 
--       }, 
--       "Price": { 
--         "order": 2, 
--         "type": "minMax" , 
--         "min": " AND price >= ", 
--         "max": " AND price <= "
--       }, 
--       "Year": { 
--         "order": 3, 
--         "type": "minMax" , 
--         "min": " AND filters->>''Year'' >= ", 
--         "max": " AND filters->>''Year'' <= "
--       } 
--     } 
--   }'
-- );
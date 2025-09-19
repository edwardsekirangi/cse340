-- Creating a test account
INSERT into account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'TonyS@gothamail.com',
        'IamIronman'
    );

-- Promoting the test account to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'TonyS@gothamail.com';

-- Deletng the test account
DELETE FROM account
WHERE account_email = 'TonyS@gothamail.com';

-- Updating inv_description for a specific vehicle
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';

-- Query to find all vehicles with classification 'Sport'
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Updating image paths for all vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

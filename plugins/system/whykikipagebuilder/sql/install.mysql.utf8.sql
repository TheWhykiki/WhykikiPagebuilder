CREATE TABLE IF NOT EXISTS `#__whykikipagebuilder` (
  `content_id` int(11) NOT NULL,
  `context` varchar(50) NOT NULL,
  `sections` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `withoutsections` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `history` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`content_id`,`context`)
);
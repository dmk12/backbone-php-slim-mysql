-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2014 at 11:09 PM
-- Server version: 5.6.11
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `teashop`
--

-- --------------------------------------------------------

--
-- Table structure for table `tea`
--

CREATE TABLE IF NOT EXISTS `tea` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) DEFAULT NULL,
  `type` varchar(25) DEFAULT NULL,
  `make` varchar(25) DEFAULT NULL,
  `description` text,
  `country` varchar(25) DEFAULT NULL,
  `weight` varchar(15) DEFAULT NULL,
  `price` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=79 ;

--
-- Dumping data for table `tea`
--

INSERT INTO `tea` (`id`, `name`, `type`, `make`, `description`, `country`, `weight`, `price`) VALUES
(4, 'Rooibos', 'red', 'McCabes', 'Red rooibos from Africa', 'Africa', '300g', '6.99'),
(5, 'Barry''s golden blend', 'green', 'Barry''s', 'Green tea in teabags.', 'Laos', '600g', '8.99'),
(19, 'Lyon''s green tea', 'green', 'Lyon''s', 'The greenest of teas!', 'India', '500g', '5.99'),
(20, 'McCabes Dark blend', 'black', 'McCabes', 'Regular tea.', 'Vietnam', '500g', '5.99'),
(76, 'McCabes Special blend', 'green', 'McCabes', 'Very nice green tea, yum.', 'India', '500g', '5.99');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

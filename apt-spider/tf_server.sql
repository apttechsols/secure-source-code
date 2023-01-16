-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 02, 2021 at 09:55 PM
-- Server version: 5.7.34-log
-- PHP Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tf_server`
--

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `uid` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `uname` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `rtime` varchar(100) NOT NULL,
  `utime` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `traffic_report`
--

CREATE TABLE `traffic_report` (
  `id` int(11) NOT NULL,
  `status` varchar(100) NOT NULL,
  `uid` varchar(100) NOT NULL,
  `rid` varchar(100) DEFAULT NULL,
  `site` text NOT NULL,
  `domain` varchar(100) NOT NULL,
  `server` varchar(100) NOT NULL,
  `data` text,
  `init_referrer` varchar(100) DEFAULT NULL,
  `link_visited` varchar(100) DEFAULT NULL,
  `visit_time` varchar(100) DEFAULT NULL,
  `exact_visit_time` varchar(100) DEFAULT NULL,
  `avg_page_visit_time` varchar(100) DEFAULT NULL,
  `process_run_time` varchar(100) DEFAULT NULL,
  `visted_ip` varchar(100) DEFAULT NULL,
  `visited_urls` text,
  `start_time` varchar(100) DEFAULT NULL,
  `exit_time` varchar(100) DEFAULT NULL,
  `mimpv` varchar(100) NOT NULL,
  `maxpv` varchar(100) NOT NULL,
  `rtime` varchar(100) NOT NULL,
  `utime` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `traffic_request_trigger`
--

CREATE TABLE `traffic_request_trigger` (
  `id` int(11) NOT NULL,
  `status` varchar(100) NOT NULL,
  `uid` varchar(100) NOT NULL,
  `site` text NOT NULL,
  `domain` varchar(100) NOT NULL,
  `server` varchar(100) NOT NULL,
  `data` text,
  `mimpv` varchar(100) NOT NULL,
  `maxpv` varchar(100) NOT NULL,
  `rtime` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uname` (`uname`);

--
-- Indexes for table `traffic_report`
--
ALTER TABLE `traffic_report`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`),
  ADD UNIQUE KEY `rid` (`rid`);

--
-- Indexes for table `traffic_request_trigger`
--
ALTER TABLE `traffic_request_trigger`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `traffic_report`
--
ALTER TABLE `traffic_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `traffic_request_trigger`
--
ALTER TABLE `traffic_request_trigger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Clear 2025 data to start fresh for 2026

-- Clear the generic tables for 2026
DELETE FROM `call_proposals`;
DELETE FROM `students`;

-- Clear supporting tables that are student/application specific
DELETE FROM `students_groups`;
DELETE FROM `students_papers`;
DELETE FROM `students_persons`;
DELETE FROM `students_travels`;
DELETE FROM `call_notes`;
DELETE FROM `call_comments`;

-- Reset auto-increment counters
ALTER TABLE `call_proposals` AUTO_INCREMENT = 1;
ALTER TABLE `students` AUTO_INCREMENT = 1;
ALTER TABLE `students_groups` AUTO_INCREMENT = 1;
ALTER TABLE `students_papers` AUTO_INCREMENT = 1;
ALTER TABLE `students_persons` AUTO_INCREMENT = 1;
ALTER TABLE `students_travels` AUTO_INCREMENT = 1;
ALTER TABLE `call_notes` AUTO_INCREMENT = 1;
ALTER TABLE `call_comments` AUTO_INCREMENT = 1;

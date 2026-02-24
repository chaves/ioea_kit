CREATE TABLE IF NOT EXISTS `students_validations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_email` VARCHAR(255) NOT NULL,
  `call_year` YEAR NOT NULL,
  `section` VARCHAR(20) NOT NULL,
  `validated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_student_section` (`student_email`, `call_year`, `section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

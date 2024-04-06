package com.backend.simpleshop.user;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);
  @Transactional
  @Modifying
  @Query("update User u set u.failedLoginAttempts = u.failedLoginAttempts + 1 where u.id = :userId")
  void incrementFailedAttempts(@Param("userId") Integer userId);

  @Transactional
  @Modifying
  @Query("update User u set u.lockoutTime = :lockoutTime where u.id = :userId")
  void lockAccount(@Param("userId") Integer userId, @Param("lockoutTime") LocalDateTime lockoutTime);

  @Transactional
  @Modifying
  @Query("update User u set u.failedLoginAttempts = 0, u.lockoutTime = null where u.id = :userId")
  void resetFailedAttemptsAndUnlockAccount(@Param("userId") Integer userId);
}

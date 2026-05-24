package com.github.gubbib.backend.Repository.Board;

import com.github.gubbib.backend.Domain.Board.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {

    boolean existsByName(String name);
}

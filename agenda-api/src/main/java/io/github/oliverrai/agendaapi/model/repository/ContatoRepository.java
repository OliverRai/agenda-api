package io.github.oliverrai.agendaapi.model.repository;

import io.github.oliverrai.agendaapi.model.entity.Contato;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ContatoRepository extends JpaRepository<Contato, Integer> {
}

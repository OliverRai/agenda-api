package io.github.oliverrai.agendaapi.api.rest;

import io.github.oliverrai.agendaapi.model.entity.Contato;
import io.github.oliverrai.agendaapi.model.repository.ContatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contatos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ContatoController {

    public final ContatoRepository repository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contato salve(@RequestBody Contato contato){
        return repository.save(contato);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id){
        repository.deleteById(id);
    }

    @GetMapping()
    public List<Contato> list(){
        return repository.findAll();
    }

    @GetMapping("{id}/favorito")
    public void Favorite(@PathVariable Integer id, @RequestBody Boolean favorito){
        Optional<Contato> contato = repository.findById(id);
        contato.ifPresent(c ->{
            c.setFavorito(favorito);
            repository.save(c);
        });
    }
}

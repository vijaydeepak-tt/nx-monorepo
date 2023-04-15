import { useEffect, useState, useCallback } from 'react';
import type { Pokimon } from '@nx-monorepo/shared-types';

import styles from './index.module.css';

export function Index({
  q,
  pokimons: initialPokimons,
}: {
  q: string;
  pokimons: Pokimon[];
}) {
  const [search, setSearch] = useState(q);
  const [pokimons, setPokimons] = useState<Pokimon[]>(initialPokimons);

  useEffect(() => {
    fetch(`http://localhost:3333/search?q=${search}`)
      .then((res) => res.json())
      .then((res) => setPokimons(res));
  }, [search]);

  const onSearch = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(evt.target.value);
  }, []);

  return (
    <div className={styles.page}>
      <input value={search} onChange={onSearch} />
      <ul>
        {pokimons.map((pokimon) => (
          <li key={pokimon.id}>{pokimon.name.english}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  let pokimons = [];
  const q = context.query.q ?? '';
  if (q) {
    pokimons = await fetch(`http://localhost:3333/search?q=${q}`).then((res) =>
      res.json()
    );
  }
  return {
    props: {
      q,
      pokimons,
    },
  };
}

export default Index;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const genres = [
    'Ação',
    'Aventura',
    'Comédia',
    'Drama',
    'Fantasia',
    'Terror',
    'Ficção Científica',
    'Romance',
    'Suspense',
    'Animação',
    'Documentário',
    'Musical',
    'Policial',
    'Guerra',
    'Mistério',
    'Biografia',
    'Histórico',
    'Esporte',
    'Faroeste',
    'Crime',
  ];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const languages = [
    'Português',
    'Inglês',
    'Espanhol',
    'Francês',
    'Alemão',
    'Italiano',
    'Japonês',
    'Chinês',
    'Russo',
    'Árabe',
    'Hindi',
    'Coreano',
    'Grego',
    'Latim',
    'Turco',
    'Hebraico',
    'Sueco',
    'Norueguês',
    'Dinamarquês',
    'Finlandês',
  ];

  for (const name of languages) {
    await prisma.language.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

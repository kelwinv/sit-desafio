#!/usr/bin/env node

const { execSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({
  path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
});

const log = (type, msg) => console.log(`${type} ${msg}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCommandWithRetry(cmd, maxAttempts = 10, delay = 3000) {
  log('⏳', 'Aguardando banco de dados...');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      execSync(cmd, { stdio: 'pipe' });
      log('✅', 'Banco conectado!');
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        log('❌', `Falhou após ${maxAttempts} tentativas: ${error.message}`);
        console.log('\n💡 Verifique:');
        console.log('  • Docker rodando');
        console.log('  • npm run services:up');
        console.log('  • Porta 3307/3308 livre');
        console.log('  • DATABASE_URL no .env');
        process.exit(1);
      }

      log(
        '🔄',
        `Tentativa ${attempt}/${maxAttempts} falhou. Aguardando ${delay / 1000}s...`,
      );
      await sleep(delay);
    }
  }
}

function runCommand(cmd, description) {
  try {
    log('🔹', description);
    execSync(cmd, { stdio: 'inherit' });
    log('✅', 'Sucesso!');
  } catch (error) {
    log('❌', `Erro: ${error.message}`);
    process.exit(1);
  }
}

async function main() {
  const env = process.env.NODE_ENV || 'development';

  console.log(`\n🚀 Setup do Banco - Ambiente: ${env}\n`);

  if (!process.env.DATABASE_URL) {
    log('❌', 'DATABASE_URL não encontrada');
    process.exit(1);
  }

  const generateScript =
    env === 'test' ? 'prisma:generate:test' : 'prisma:generate';
  const migrateScript =
    env === 'test' ? 'prisma:migrate:test' : 'prisma:migrate:dev';

  runCommand(`npm run ${generateScript}`, 'Gerando Prisma Client...');

  await runCommandWithRetry(`npm run ${migrateScript}`);

  log('🎉', 'Setup concluído com sucesso!\n');
}

main();

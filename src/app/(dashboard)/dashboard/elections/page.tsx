import { Container } from '@/components/shared/container';
import styles from '@/css/dashboard/elections.module.css';
import {
  getElections,
  createElection,
  deleteElection,
  addCandidate,
  getUsers,
} from '@/lib/action/election';

export default async function AdminElectionsPage() {
  const electionsList = await getElections();
  const usersList = await getUsers();

  return (
    <Container>
      <h1 className={styles.pageTitle}>Керування виборами</h1>

      <section className={styles.createSection}>
        <h2 className={styles.sectionTitle}>Створити нові вибори</h2>
        <form action={createElection} className={styles.formGroup}>
          <input
            type="text"
            name="title"
            placeholder="Назва виборів"
            required
            className={styles.input}
          />
          <textarea
            name="description"
            placeholder="Опис"
            className={`${styles.input} ${styles.textarea}`}
          />
          <button type="submit" className={styles.primaryButton}>
            Створити вибори
          </button>
        </form>
      </section>

      <section>
        <h2 className={styles.listTitle}>Існуючі вибори</h2>
        {electionsList.map((election) => {
          const totalVotes = election.votes?.length || 0;

          const getCandidateVotes = (candidateId: string) => {
            return (
              election.votes?.filter((vote) => vote.candidateId === candidateId)
                .length || 0
            );
          };

          return (
            <div key={election.id} className={styles.electionCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.electionTitle}>{election.title}</h3>
                  <p className={styles.electionDesc}>{election.description}</p>
                </div>
                <form
                  action={async () => {
                    'use server';
                    await deleteElection(election.id);
                  }}>
                  <button type="submit" className={styles.deleteButton}>
                    Видалити вибори
                  </button>
                </form>
              </div>

              <div className={styles.resultsSection}>
                <h4 className={styles.resultsTitle}>
                  Поточні результати{' '}
                  <span className={styles.badge}>
                    Усього голосів: {totalVotes}
                  </span>
                </h4>

                <div className={styles.votesGrid}>
                  {election.candidates.map((candidate) => {
                    const votesCount = getCandidateVotes(candidate.id);
                    const percentage =
                      totalVotes > 0
                        ? Math.round((votesCount / totalVotes) * 100)
                        : 0;

                    return (
                      <div
                        key={`result-${candidate.id}`}
                        className={styles.voteStatCard}>
                        <div className={styles.voteStatHeader}>
                          <span className={styles.statName}>
                            {candidate.name}
                          </span>
                          <span className={styles.statCount}>
                            {votesCount} votes ({percentage}%)
                          </span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div
                            className={styles.progressBarFill}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {election.candidates.length === 0 && (
                    <p className={styles.emptyText}>Кандидатів ще не додано.</p>
                  )}
                </div>

                <details className={styles.votersDetails}>
                  <summary className={styles.votersSummary}>
                    Переглянути детальний список виборців
                  </summary>
                  <div className={styles.votersListContainer}>
                    {totalVotes === 0 ? (
                      <p className={styles.emptyText}>Голосів ще не було.</p>
                    ) : (
                      <table className={styles.votersTable}>
                        <thead>
                          <tr>
                            <th>Ім’я студента</th>
                            <th>№ квитка</th>
                            <th>Голос за</th>
                          </tr>
                        </thead>
                        <tbody>
                          {election.votes.map((vote) => {
                            const votedCandidate = election.candidates.find(
                              (c) => c.id === vote.candidateId,
                            );
                            return (
                              <tr key={vote.id}>
                                <td>
                                  {vote.firstName} {vote.lastName}
                                </td>
                                <td>{vote.studentId}</td>
                                <td>{votedCandidate?.name || 'Невідомо'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </details>
              </div>

              <div className={styles.candidatesSection}>
                <h4 className={styles.candidatesTitle}>
                  Керування кандидатами ({election.candidates.length})
                </h4>

                <form action={addCandidate} className={styles.addCandidateForm}>
                  <input type="hidden" name="electionId" value={election.id} />

                  <select
                    name="userId"
                    required
                    defaultValue=""
                    className={styles.addCandidateInput}>
                    <option value="" disabled>
                      Оберіть зареєстрованого користувача...
                    </option>
                    {usersList.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </option>
                    ))}
                  </select>

                  <button type="submit" className={styles.successButton}>
                    Додати кандидата
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </section>
    </Container>
  );
}

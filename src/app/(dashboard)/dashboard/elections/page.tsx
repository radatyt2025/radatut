// app/admin/elections/page.tsx

import styles from '@/css/dashboard/elections.module.css';
import { getElections, createElection, deleteElection, addCandidate, getUsers } from '@/lib/action/election'; 

export default async function AdminElectionsPage() {
  const electionsList = await getElections();
  const usersList = await getUsers();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Manage Elections</h1>

      {/* Create New Election */}
      <section className={styles.createSection}>
        <h2 className={styles.sectionTitle}>Create New Election</h2>
        <form action={createElection} className={styles.formGroup}>
          <input 
            type="text" 
            name="title" 
            placeholder="Election Title" 
            required 
            className={styles.input}
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            className={`${styles.input} ${styles.textarea}`}
          />
          <button type="submit" className={styles.primaryButton}>
            Create Election
          </button>
        </form>
      </section>

      {/* Existing Elections List */}
      <section>
        <h2 className={styles.listTitle}>Existing Elections</h2>
        {electionsList.map((election) => {
          // Calculate total votes
          const totalVotes = election.votes?.length || 0;

          // Helper function to get votes for a specific candidate
          const getCandidateVotes = (candidateId: string) => {
            return election.votes?.filter((vote) => vote.candidateId === candidateId).length || 0;
          };

          return (
            <div key={election.id} className={styles.electionCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.electionTitle}>{election.title}</h3>
                  <p className={styles.electionDesc}>{election.description}</p>
                </div>
                <form action={async () => {
                  'use server';
                  await deleteElection(election.id);
                }}>
                  <button type="submit" className={styles.deleteButton}>
                    Delete Election
                  </button>
                </form>
              </div>

              {/* LIVE RESULTS SECTION */}
              <div className={styles.resultsSection}>
                <h4 className={styles.resultsTitle}>
                  Live Results <span className={styles.badge}>Total Votes: {totalVotes}</span>
                </h4>
                
                {/* Votes per candidate */}
                <div className={styles.votesGrid}>
                  {election.candidates.map((candidate) => {
                    const votesCount = getCandidateVotes(candidate.id);
                    const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                    
                    return (
                      <div key={`result-${candidate.id}`} className={styles.voteStatCard}>
                        <div className={styles.voteStatHeader}>
                          <span className={styles.statName}>{candidate.name}</span>
                          <span className={styles.statCount}>{votesCount} votes ({percentage}%)</span>
                        </div>
                        {/* Progress Bar */}
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
                    <p className={styles.emptyText}>No candidates added yet.</p>
                  )}
                </div>

                {/* Collapsible Voters List */}
                <details className={styles.votersDetails}>
                  <summary className={styles.votersSummary}>View detailed voter list</summary>
                  <div className={styles.votersListContainer}>
                    {totalVotes === 0 ? (
                      <p className={styles.emptyText}>No votes have been cast yet.</p>
                    ) : (
                      <table className={styles.votersTable}>
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Ticket №</th>
                            <th>Voted For</th>
                          </tr>
                        </thead>
                        <tbody>
                          {election.votes.map((vote) => {
                            const votedCandidate = election.candidates.find(c => c.id === vote.candidateId);
                            return (
                              <tr key={vote.id}>
                                <td>{vote.firstName} {vote.lastName}</td>
                                <td>{vote.studentId}</td>
                                <td>{votedCandidate?.name || 'Unknown'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </details>
              </div>

              {/* CANDIDATES MANAGEMENT SECTION */}
              <div className={styles.candidatesSection}>
                <h4 className={styles.candidatesTitle}>Manage Candidates ({election.candidates.length})</h4>
                
                <form action={addCandidate} className={styles.addCandidateForm}>
                  <input type="hidden" name="electionId" value={election.id} />
                  
                  <select 
                    name="userId" 
                    required 
                    defaultValue=""
                    className={styles.addCandidateInput}
                  >
                    <option value="" disabled>Select a registered user to add...</option>
                    {usersList.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </option>
                    ))}
                  </select>

                  <button type="submit" className={styles.successButton}>
                    Add Candidate
                  </button>
                </form>
              </div>

            </div>
          );
        })}
      </section>
    </div>
  );
}
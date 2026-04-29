import { Elysia, t } from 'elysia'

// 1. In-memory Database
let interns = [
  { id: 1, name: "Khushali", role: "Backend Intern" },
  { id: 2, name: "khushii", role: "Full Stack Intern" }
];

const app = new Elysia()
  
  // --- READ ---
  .get('/interns', () => ({
    success: true,
    data: interns
  }))

  // --- CREATE ---
  .post('/interns', ({ body, set }) => {
    const lastId = interns.at(-1)?.id ?? 0;
    const newIntern = {
      id: lastId + 1,
      name: body.name,
      role: body.role
    };
    
    interns.push(newIntern);
    set.status = 201;
    return { message: "Intern added successfully!", intern: newIntern };
  }, {
    body: t.Object({
      name: t.String(),
      role: t.String()
    })
  })

// --- PATCH (Partial Update) ---
  
  .patch('/interns/:id', ({ params: { id }, body, set }) => {
    const internId = Number(id);
    const index = interns.findIndex(i => Number(i.id) === internId);

    if (index === -1) {
      set.status = 404;
      return { error: `Intern with ID ${id} not found!` };
    }

     
    interns[index] = { 
        ...interns[index], 
        ...(body as any) 
    };
    
    return { 
        success: true,
        message: "Intern patched successfully!", 
        updatedData: interns[index] 
    };
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      role: t.Optional(t.String())
    })
  })

  // --- DELETE ---
  .delete('/interns/:id', ({ params: { id }, set }) => {
    const internId = Number(id);
    const originalLength = interns.length;
    
    interns = interns.filter((i) => i.id !== internId);

    if (interns.length === originalLength) {
      set.status = 404;
      return { error: "Intern not found!" };
    }

    return { message: `Intern with ID ${id} deleted.` };
  })

  .listen(3000)

console.log(`🚀 Bun Server is running at http://localhost:3000`);
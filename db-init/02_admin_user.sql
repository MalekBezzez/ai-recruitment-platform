-- 03_seed_full.sql
-- Remplit des tables de référence + utilisateurs + relations clés
-- Idempotent (WHERE NOT EXISTS / ON CONFLICT)
BEGIN;

-- 0) Prérequis pour bcrypt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Tables de référence (départements, contrats, diplômes, sites/salles, client)
-- Department
WITH d AS (
  SELECT id FROM public.department WHERE department_name = 'Engineering'
)
INSERT INTO public.department(department_name)
SELECT 'Engineering'
WHERE NOT EXISTS (SELECT 1 FROM d);

WITH d AS (
  SELECT id FROM public.department WHERE department_name = 'Human Resources'
)
INSERT INTO public.department(department_name)
SELECT 'Human Resources'
WHERE NOT EXISTS (SELECT 1 FROM d);

-- Contract types
WITH c AS (
  SELECT id FROM public.contract_type WHERE contract_type_name = 'CDI'
)
INSERT INTO public.contract_type(contract_type_name)
SELECT 'CDI' WHERE NOT EXISTS (SELECT 1 FROM c);

WITH c AS (
  SELECT id FROM public.contract_type WHERE contract_type_name = 'CDD'
)
INSERT INTO public.contract_type(contract_type_name)
SELECT 'CDD' WHERE NOT EXISTS (SELECT 1 FROM c);

-- Diploma types
WITH dt AS (
  SELECT id_diploma_type FROM public.diploma_type WHERE diploma_name = 'Bachelor' AND speciality = 'Computer Science'
)
INSERT INTO public.diploma_type(diploma_name, speciality)
SELECT 'Bachelor','Computer Science' WHERE NOT EXISTS (SELECT 1 FROM dt);

WITH dt AS (
  SELECT id_diploma_type FROM public.diploma_type WHERE diploma_name = 'Master' AND speciality = 'IA'
)
INSERT INTO public.diploma_type(diploma_name, speciality)
SELECT 'Master','IA' WHERE NOT EXISTS (SELECT 1 FROM dt);

-- Currency et Work mode
INSERT INTO public.currency (currency_name)
SELECT x.val FROM (VALUES ('EUR'),('TND'),('USD')) AS x(val)
WHERE NOT EXISTS (SELECT 1 FROM public.currency c WHERE c.currency_name = x.val);

INSERT INTO public.work_mode (work_mode_name)
SELECT x.val FROM (VALUES ('Remote'),('Hybrid'),('On-site')) AS x(val)
WHERE NOT EXISTS (SELECT 1 FROM public.work_mode w WHERE w.work_mode_name = x.val);

-- Sites / Rooms
WITH s AS (
  INSERT INTO public.site(site_name)
  SELECT 'HQ Bizerte'
  WHERE NOT EXISTS (SELECT 1 FROM public.site WHERE site_name='HQ Bizerte')
  RETURNING site_id
), got AS (
  SELECT site_id FROM s
  UNION
  SELECT site_id FROM public.site WHERE site_name='HQ Bizerte'
)
INSERT INTO public.room(name, site_id)
SELECT 'Salle 101', (SELECT site_id FROM got)
WHERE NOT EXISTS (SELECT 1 FROM public.room WHERE name='Salle 101');

-- Client
WITH c AS (
  INSERT INTO public.client(name, email, phone, address)
  SELECT 'Onetech', 'contact@onetech.tn', '+21670000000', 'Bizerte'
  WHERE NOT EXISTS (SELECT 1 FROM public.client WHERE name='Onetech')
  RETURNING client_id
)
SELECT 1;

-- 2) Utilisateurs + Employés
-- Admin
INSERT INTO public.app_user (dtype, cin, email, firstname, lastname, password, role)
VALUES ('User','00000000','admin@example.com','Admin','User', crypt('admin123', gen_salt('bf')), 'ADMIN')
ON CONFLICT (email) DO UPDATE SET
  firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, password=EXCLUDED.password, role=EXCLUDED.role;

-- FK référence
WITH refs AS (
  SELECT
    (SELECT id FROM public.department WHERE department_name='Human Resources' LIMIT 1) AS dep_hr,
    (SELECT id FROM public.department WHERE department_name='Engineering' LIMIT 1) AS dep_eng,
    (SELECT id FROM public.contract_type WHERE contract_type_name='CDI' LIMIT 1) AS cdi
),

-- Sonia RH
u_rh AS (
  INSERT INTO public.app_user(dtype, cin, email, firstname, lastname, password, role)
  VALUES ('Employe','11111111','rh@example.com','Sonia','RH', crypt('rh123', gen_salt('bf')), 'RH')
  ON CONFLICT (email) DO UPDATE 
    SET firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, password=EXCLUDED.password, role=EXCLUDED.role
  RETURNING id
), 
e_rh AS (
  INSERT INTO public.employe(id, job_title, gender, salary, number_of_children, martial_status, worktime,
                             hire_date, seniority, professionalemail, department_id, contract_type_id)
  SELECT id, 'HR Specialist','FEMALE', 2500, 0,'SINGLE','H40','2023-02-01','MIDJUNIOR',
         'sonia.rh@company.com', (SELECT dep_hr FROM refs), (SELECT cdi FROM refs)
  FROM u_rh
  ON CONFLICT (id) DO UPDATE 
    SET job_title=EXCLUDED.job_title, gender=EXCLUDED.gender, salary=EXCLUDED.salary,
        number_of_children=EXCLUDED.number_of_children, martial_status=EXCLUDED.martial_status,
        worktime=EXCLUDED.worktime, hire_date=EXCLUDED.hire_date, seniority=EXCLUDED.seniority,
        professionalemail=EXCLUDED.professionalemail, department_id=EXCLUDED.department_id, 
        contract_type_id=EXCLUDED.contract_type_id
  RETURNING id
),

-- Ahmed (Super Manager)
u_sm AS (
  INSERT INTO public.app_user(dtype, cin, email, firstname, lastname, password, role)
  VALUES ('Employe','44444444','supermanager@example.com','Ahmed','SuperManager', crypt('super123', gen_salt('bf')), 'MANAGER')
  ON CONFLICT (email) DO UPDATE 
    SET firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, password=EXCLUDED.password, role=EXCLUDED.role
  RETURNING id
), 
e_sm AS (
  INSERT INTO public.employe(id, job_title, gender, salary, number_of_children, martial_status, worktime,
                             hire_date, seniority, professionalemail, department_id, contract_type_id)
  SELECT id, 'Senior Manager','MALE', 5000, 1,'MARRIED','H40','2023-01-15','SENIOR',
         'ahmed.supermanager@company.com', (SELECT dep_eng FROM refs), (SELECT cdi FROM refs)
  FROM u_sm
  ON CONFLICT (id) DO UPDATE 
    SET job_title=EXCLUDED.job_title, gender=EXCLUDED.gender, salary=EXCLUDED.salary,
        number_of_children=EXCLUDED.number_of_children, martial_status=EXCLUDED.martial_status,
        worktime=EXCLUDED.worktime, hire_date=EXCLUDED.hire_date, seniority=EXCLUDED.seniority,
        professionalemail=EXCLUDED.professionalemail, department_id=EXCLUDED.department_id, 
        contract_type_id=EXCLUDED.contract_type_id
  RETURNING id
),

-- Karim (Manager intermédiaire)
u_m AS (
  INSERT INTO public.app_user(dtype, cin, email, firstname, lastname, password, role)
  VALUES ('Employe','33333333','manager@example.com','Karim','Manager', crypt('manager123', gen_salt('bf')), 'MANAGER')
  ON CONFLICT (email) DO UPDATE 
    SET firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, password=EXCLUDED.password, role=EXCLUDED.role
  RETURNING id
), 
e_m AS (
  INSERT INTO public.employe(id, job_title, gender, salary, number_of_children, martial_status, worktime,
                             manager_id, hire_date, seniority, professionalemail, department_id, contract_type_id)
  SELECT u_m.id, 'Project Manager','MALE', 3500, 2,'MARRIED','H40',
         (SELECT id FROM e_sm), '2023-03-10','SENIOR','karim.manager@company.com',
         (SELECT dep_eng FROM refs), (SELECT cdi FROM refs)
  FROM u_m
  ON CONFLICT (id) DO UPDATE 
    SET job_title=EXCLUDED.job_title, gender=EXCLUDED.gender, salary=EXCLUDED.salary,
        number_of_children=EXCLUDED.number_of_children, martial_status=EXCLUDED.martial_status,
        worktime=EXCLUDED.worktime, manager_id=EXCLUDED.manager_id, hire_date=EXCLUDED.hire_date, 
        seniority=EXCLUDED.seniority, professionalemail=EXCLUDED.professionalemail, 
        department_id=EXCLUDED.department_id, contract_type_id=EXCLUDED.contract_type_id
  RETURNING id
),

-- Ali (Employé)
u_emp AS (
  INSERT INTO public.app_user(dtype, cin, email, firstname, lastname, password, role)
  VALUES ('Employe','22222222','employee@example.com','Ali','Employee', crypt('emp123', gen_salt('bf')), 'EMPLOYEE')
  ON CONFLICT (email) DO UPDATE 
    SET firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, password=EXCLUDED.password, role=EXCLUDED.role
  RETURNING id
), 
e_emp AS (
  INSERT INTO public.employe(id, job_title, gender, salary, number_of_children, martial_status, worktime,
                             manager_id, hire_date, seniority, professionalemail, department_id, contract_type_id)
  SELECT u_emp.id, 'Software Engineer','MALE', 1800, 0,'SINGLE','H40',
         (SELECT id FROM e_m),'2023-06-05','JUNIOR','ali.employee@company.com',
         (SELECT dep_eng FROM refs), (SELECT cdi FROM refs)
  FROM u_emp
  ON CONFLICT (id) DO UPDATE 
    SET job_title=EXCLUDED.job_title, gender=EXCLUDED.gender, salary=EXCLUDED.salary,
        number_of_children=EXCLUDED.number_of_children, martial_status=EXCLUDED.martial_status,
        worktime=EXCLUDED.worktime, manager_id=EXCLUDED.manager_id, hire_date=EXCLUDED.hire_date, 
        seniority=EXCLUDED.seniority, professionalemail=EXCLUDED.professionalemail, 
        department_id=EXCLUDED.department_id, contract_type_id=EXCLUDED.contract_type_id
  RETURNING id
),

-- Insertion des compétences pour chaque employé
skills AS (
  INSERT INTO public.employee_skills(name, current_level, target_level, employe_id)
  SELECT 'Communication', 3, 5, id FROM e_rh
  UNION ALL
  SELECT 'Recruitment', 2, 4, id FROM e_rh
  UNION ALL
  SELECT 'Conflict Management', 2, 3, id FROM e_rh
  UNION ALL
  SELECT 'Leadership', 4, 5, id FROM e_sm
  UNION ALL
  SELECT 'Strategic Planning', 3, 5, id FROM e_sm
  UNION ALL
  SELECT 'Decision Making', 4, 5, id FROM e_sm
  UNION ALL
  SELECT 'Team Management', 3, 5, id FROM e_m
  UNION ALL
  SELECT 'Project Coordination', 3, 4, id FROM e_m
  UNION ALL
  SELECT 'Communication', 2, 4, id FROM e_m
  UNION ALL
  SELECT 'Java', 2, 4, id FROM e_emp
  UNION ALL
  SELECT 'React', 1, 3, id FROM e_emp
  UNION ALL
  SELECT 'Docker', 1, 3, id FROM e_emp
  RETURNING id
)
SELECT 1;

-- Career path
INSERT INTO career_path_need_company (career_path_name)
SELECT x.val
FROM (VALUES
  ('DevOps Engineer'),
  ('Cloud Architect'),
  ('Tech Lead'),
  ('Frontend Specialist'),
  ('Backend Specialist'),
  ('AI Engineer'),
  ('Database Administrator')
) AS x(val)
WHERE NOT EXISTS (SELECT 1 FROM career_path_need_company c WHERE c.career_path_name=x.val);

-- 3) Types de congé + soldes cohérents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='unique_leave_sold_employe_leave_type'
      AND conrelid='public.leave_sold'::regclass
  ) THEN
    ALTER TABLE public.leave_sold
    ADD CONSTRAINT unique_leave_sold_employe_leave_type UNIQUE (employe_id, leave_type_id);
  END IF;
END $$;

-- Types de congé de base
INSERT INTO public.leave_type(type, solde)
SELECT x.t, x.s FROM (VALUES ('Annuel', 15), ('Maladie', 30)) AS x(t,s)
WHERE NOT EXISTS (SELECT 1 FROM public.leave_type lt WHERE lt.type=x.t);

-- Soldes pour chaque employé
WITH
  lt AS (
    SELECT id_leave_type, type
    FROM public.leave_type
    WHERE type IN ('Annuel','Maladie')
  ),
  emp AS (
    SELECT id AS employe_id FROM public.employe
  )
INSERT INTO public.leave_sold(solde, employe_id, leave_type_id)
SELECT 
  CASE lt.type 
    WHEN 'Annuel' THEN 15.0
    WHEN 'Maladie' THEN 30.0
  END AS solde,
  e.employe_id,
  lt.id_leave_type
FROM emp e
CROSS JOIN lt
WHERE NOT EXISTS (
  SELECT 1 FROM public.leave_sold s 
  WHERE s.employe_id=e.employe_id AND s.leave_type_id=lt.id_leave_type
);

-- 4) Projet / Phase / Tâche
WITH c AS (
  SELECT client_id FROM public.client WHERE name='Onetech' LIMIT 1
), prj AS (
  INSERT INTO public.project(name, total_hours, started_date, end_date, client_id)
  SELECT 'HR-Platform Modernization', 400, '2025-01-10', '2025-06-30', c.client_id
  FROM c
  WHERE NOT EXISTS (SELECT 1 FROM public.project WHERE name='HR-Platform Modernization')
  RETURNING project_id
), prj_id AS (
  SELECT project_id FROM prj
  UNION SELECT project_id FROM public.project WHERE name='HR-Platform Modernization'
), ph AS (
  INSERT INTO public.phase(name, total_hours, started_date, end_date, description, project_id)
  SELECT 'Sprint 1', 100, '2025-01-10', '2025-02-10', 'Initial foundation', (SELECT project_id FROM prj_id)
  WHERE NOT EXISTS (SELECT 1 FROM public.phase WHERE name='Sprint 1' AND project_id=(SELECT project_id FROM prj_id))
  RETURNING phase_id
), users AS (
  SELECT
    (SELECT id FROM public.app_user WHERE email='manager@example.com')  AS karim_id,
    (SELECT id FROM public.app_user WHERE email='supermanager@example.com') AS ahmed_id
)
INSERT INTO public.task(name, description, priority, status, estimated_time, actual_time, created_date,
                        due_date, assignee_id, reporter_id, phase_id, project_id, jira_key)
SELECT 'Build Gateway', 'API Gateway config', 'HIGH', 'IN_PROGRESS', 24, 8, now(),
       '2025-02-05', (SELECT karim_id FROM users), (SELECT ahmed_id FROM users),
       (SELECT phase_id FROM ph), (SELECT project_id FROM prj_id), 'GW-1'
WHERE NOT EXISTS (SELECT 1 FROM public.task WHERE jira_key='GW-1');

COMMIT;

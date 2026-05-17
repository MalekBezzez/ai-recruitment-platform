from sqlalchemy import text
from database import AsyncSessionLocal
import json
import asyncio

async def get_offre_details(offer_id: int) -> dict:
    async with AsyncSessionLocal() as db:
        sql = text("""
            SELECT 
                o.id as offre_id,
                o.job_title,
                o.sections,
                o.years_of_exp,
                ct.contract_type_name,
                dt.diploma_name,
                dt.speciality
            FROM offers o
            LEFT JOIN contract_type ct ON o.contract_type_id = ct.id
            LEFT JOIN diploma_type dt ON o.diploma_type_id = dt.id_diploma_type
            WHERE o.id = :offer_id
        """)

        result = await db.execute(sql, {"offer_id": offer_id})
        row = result.mappings().first()

        if not row:
            return {}

        offer_dict = {
            "offre_id": row["offre_id"],
            "job_title": row["job_title"],
            "years_of_exp": row["years_of_exp"],
            "contract_type": row["contract_type_name"],
            "education": {
                "diploma_name": row["diploma_name"],
                "speciality": row["speciality"]
            }
        }

        try:
            sections = row["sections"]  # Pas besoin de json.loads()
            if isinstance(sections, dict):
                offer_dict.update(sections)
            else:
                print(f"Avertissement : 'sections' n'est pas un dictionnaire : {sections}")
        except Exception as e:
            print(f"Erreur parsing sections JSON: {e}")

        return offer_dict

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UnitTests_GetPrimaryKeys]') AND type in (N'P', N'PC'))
	DROP PROCEDURE [dbo].[sp_UnitTests_GetPrimaryKeys]
GO

CREATE Procedure [dbo].[sp_UnitTests_GetPrimaryKeys]
AS
	SELECT TABLE_NAME as TableName, COLUMN_NAME as ColumnName, DATA_TYPE as DataType
	FROM INFORMATION_SCHEMA.COLUMNS
	WHERE COLUMNPROPERTY(OBJECT_ID(TABLE_SCHEMA+'.'+TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1 OR ORDINAL_POSITION = 1
	ORDER BY TABLE_NAME
GO
